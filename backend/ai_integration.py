import os
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_huggingface import HuggingFacePipeline
from langchain.prompts import ChatPromptTemplate
from langchain.chains import LLMChain
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import HuggingFaceEmbeddings
import asyncio

# Configuration - Choose your model
MODEL_PROVIDER = os.getenv("MODEL_PROVIDER", "gemini")  # "gemini" or "huggingface"
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
HF_API_KEY = os.getenv("HUGGINGFACE_API_KEY", "")


# Initialize LLM based on provider
def get_llm():
    if MODEL_PROVIDER == "gemini":
        return ChatGoogleGenerativeAI(
            model="gemini-2.5-flash-lite",
            temperature=0.5
        )
    else:  # huggingface
        LOCAL_MODEL_ID = "google/gemma-3-270m-it"

        return HuggingFacePipeline.from_model_id(
            model_id=LOCAL_MODEL_ID,
            task="text-generation",
            pipeline_kwargs={
                "max_new_tokens": 400,
                "temperature": 0.7
            })


llm = get_llm()

# Initialize RAG components
def get_vectorstore():
    """Load the existing vector store"""
    persist_dir = "./vectorstore"
    collection_name = "CGM_Agent"

    embeddings = HuggingFaceEmbeddings(
        model_name="sentence-transformers/all-MiniLM-L6-v2",
        model_kwargs={'device': 'cpu'},
        encode_kwargs={'normalize_embeddings': True}
    )

    vectorstore = Chroma(
        persist_directory=persist_dir,
        embedding_function=embeddings,
        collection_name=collection_name
    )

    return vectorstore


# Load vector store once
try:
    vectorstore = get_vectorstore()
    print("✓ Vector store loaded successfully")
except Exception as e:
    print(f"Warning: Could not load vector store: {e}")
    vectorstore = None


async def child_chatbot(message: str, age: int = 15):
    """Child-friendly chatbot with safety education"""

    system_prompt = f"""You are a friendly, caring virtual friend for children aged around {age} years.
    Teach them about good touch/bad touch, personal safety, and saying no.
    Use simple language, emojis, and be encouraging.
    If you detect distress, suggest talking to a trusted adult.
    Keep responses short and age-appropriate."""

    # Create chat prompt
    prompt = ChatPromptTemplate.from_messages([
        ("system", system_prompt),
        ("human", f"{message}")
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
    """Parent guidance chatbot with expert advice and RAG"""

    # Retrieve relevant context from vector store
    context = ""
    if vectorstore:
        print("\n--- RAG Retrieval ---")
        retriever = vectorstore.as_retriever(search_kwargs={"k": 3})
        relevant_docs = retriever.get_relevant_documents(message)

        print(f"Retrieved {len(relevant_docs)} relevant documents:")
        for i, doc in enumerate(relevant_docs, 1):
            print(f"\nDocument {i}:")
            print(f"Source: {doc.metadata.get('source', 'Unknown')}")
            print(f"Content: {doc.page_content[:200]}...")

        # Combine retrieved documents into context
        context = "\n\n".join([doc.page_content for doc in relevant_docs])
        print(f"\n✓ RAG context prepared ({len(context)} characters)")
        print("--- End RAG Retrieval ---\n")

    system_prompt = f"""You are an expert advisor helping parents talk to their children
    about personal safety, good touch/bad touch, and recognizing warning signs.
    Provide practical, empathetic advice with actionable steps.
    Reference child psychology and safety best practices.
    Be supportive and non-judgmental.

    Use the following context from expert sources to inform your response:

    {context}

    If the context is relevant, incorporate it naturally into your advice."""

    # Create chat prompt
    prompt = ChatPromptTemplate.from_messages([
        ("system", system_prompt),
        ("human", f"{message}")
    ])

    # Run chain
    chain = prompt | llm
    response = await chain.ainvoke({"message": message})

    # Extract text from response
    if hasattr(response, 'content'):
        return response.content
    else:
        return str(response)


async def main():
    # Example usage for the child chatbot
    child_response = await child_chatbot("I am feeling uncomfortable.")
    print("--- Child Chatbot Response ---")
    print(f"Response: {child_response['response']}")
    print(f"Distress Detected: {child_response['distressDetected']}")

    print("\n" + "=" * 80 + "\n")

    # Example usage for the parent chatbot with RAG
    print("--- Parent Chatbot Example ---")
    parent_response = await parent_chatbot("How do I start a conversation with my 8-year-old about 'private parts'?")
    print(f"\nFinal Response: {parent_response}")


if __name__ == "__main__":
    asyncio.run(main())