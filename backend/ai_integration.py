import os
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_huggingface import HuggingFaceEndpoint
from langchain.schema import HumanMessage, SystemMessage
from langchain.prompts import ChatPromptTemplate
from langchain.chains import LLMChain

# Configuration - Choose your model
MODEL_PROVIDER = os.getenv("MODEL_PROVIDER", "gemini")  # "gemini" or "huggingface"
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "your-gemini-api-key")
HF_API_KEY = os.getenv("HUGGINGFACE_API_KEY", "your-hf-api-key")

# Initialize LLM based on provider
def get_llm():
    if MODEL_PROVIDER == "gemini":
        return ChatGoogleGenerativeAI(
            model="gemini-pro",
            google_api_key=GEMINI_API_KEY,
            temperature=0.7
        )
    else:  # huggingface
        return HuggingFaceEndpoint(
            repo_id="mistralai/Mistral-7B-Instruct-v0.2",
            huggingfacehub_api_token=HF_API_KEY,
            temperature=0.7,
            max_new_tokens=300
        )

llm = get_llm()

async def child_chatbot(message: str):
    """Child-friendly chatbot with safety education"""

    system_prompt = """You are a friendly, caring virtual friend for children aged 6-12. 🌟
    Teach them about good touch/bad touch, personal safety, and saying no.
    Use simple language, emojis, and be encouraging.
    If you detect distress, suggest talking to a trusted adult.
    Keep responses short and age-appropriate."""

    # Create chat prompt
    prompt = ChatPromptTemplate.from_messages([
        ("system", system_prompt),
        ("human", "{message}")
    ])

    # Run chain
    chain = prompt | llm
    response = await chain.ainvoke({"message": message})

    # Extract text from response
    if hasattr(response, 'content'):
        response_text = response.content
    else:
        response_text = str(response)

    # Check for distress keywords
    distress_keywords = ["hurt", "uncomfortable", "scared", "touched", "secret", "help", "afraid"]
    distress_detected = any(word in message.lower() for word in distress_keywords)

    return {
        "response": response_text,
        "distressDetected": distress_detected
    }

async def parent_chatbot(message: str):
    """Parent guidance chatbot with expert advice"""

    system_prompt = """You are an expert advisor helping parents talk to their children 
    about personal safety, good touch/bad touch, and recognizing warning signs.
    Provide practical, empathetic advice with actionable steps.
    Reference child psychology and safety best practices.
    Be supportive and non-judgmental."""

    # Create chat prompt
    prompt = ChatPromptTemplate.from_messages([
        ("system", system_prompt),
        ("human", "{message}")
    ])

    # Run chain
    chain = prompt | llm
    response = await chain.ainvoke({"message": message})

    # Extract text from response
    if hasattr(response, 'content'):
        return response.content
    else:
        return str(response)
