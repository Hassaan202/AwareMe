import os
import bs4
import re
from dotenv import load_dotenv
from langchain_community.document_loaders import WebBaseLoader
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma

# Load API key
load_dotenv()
user_agent = "Mozilla/5.0(Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15"

# URLs to scrape
web_urls = [
    'https://www.utmb.edu/pedi/home/treating-children-well/2020/04/20/good-touch-and-bad-touch',
    'https://pmc.ncbi.nlm.nih.gov/articles/PMC10613817/',
    'https://www.unicef.org/child-protection',
    'https://www.who.int/news-room/fact-sheets/detail/child-maltreatment',
    'https://www.ispcan.org/',
    'https://www.childhelphotline.org/',
    'https://www.childwelfare.gov/',
    'https://www.missingkids.org/'
]

loader = WebBaseLoader(web_urls)
docs = loader.load()

print(f"Raw docs: {len(docs)}")


def clean_text(text):
    """Clean text by removing unnecessary whitespace and formatting issues."""
    # Remove excessive whitespace and newlines
    text = re.sub(r'\n\s*\n+', '\n\n', text)
    text = re.sub(r'[ \t]+', ' ', text)

    # Remove leading/trailing whitespace from each line
    lines = [line.strip() for line in text.split('\n')]
    text = '\n'.join(lines)

    # Remove lines that are just whitespace
    lines = [line for line in text.split('\n') if line.strip()]
    text = '\n'.join(lines)

    # Remove special characters that appear multiple times
    text = re.sub(r'[↵•]{2,}', '', text)
    text = re.sub(r'[\u200b-\u200d\ufeff]', '', text)  # Remove zero-width chars

    # Remove extra spaces around punctuation
    text = re.sub(r'\s+([,.!?;:])', r'\1', text)

    # Fix spacing after punctuation
    text = re.sub(r'([,.!?;:])([A-Za-z])', r'\1 \2', text)

    # Remove any remaining excessive whitespace
    text = ' '.join(text.split())

    return text.strip()


def filter_and_clean_documents(docs):
    """Filter and clean documents."""
    filtered = []
    for doc in docs:
        content = doc.page_content.lower()

        if (
                "subscription" not in content and
                "sorry something went wrong" not in content and
                len(doc.page_content.strip()) > 200 and
                "retry" not in content
        ):
            # Clean the document content
            doc.page_content = clean_text(doc.page_content)

            # Only add if still has substantial content after cleaning
            if len(doc.page_content.strip()) > 200:
                filtered.append(doc)
                print(f"✓ Cleaned document from {doc.metadata.get('source', 'Unknown')}")

    return filtered


docs = filter_and_clean_documents(docs)
print(f"\nAfter filtering and cleaning: {len(docs)} documents")

with open("file.txt", "w", encoding="utf-8") as f:
    for i, doc in enumerate(docs, 1):
        f.write(f"=== Document {i} ===\n")
        f.write(f"Source: {doc.metadata.get('source', 'Unknown')}\n")
        f.write(f"Content length: {len(doc.page_content)} characters\n")
        f.write(f"Content preview:\n{doc.page_content[:1000]}\n")
        f.write("=" * 80 + "\n\n")

# Text splitting
splitter = RecursiveCharacterTextSplitter(
    chunk_size=1200,
    chunk_overlap=200,
    separators=["\n\n", "\n", ". ", " ", ""]
)
splits = splitter.split_documents(docs)
print(f"Created {len(splits)} chunks")

# Store in persistent Chroma DB
persist_dir = "./vectorstore"
collection_name = "CGM_Agent"

if not os.path.exists(persist_dir):
    os.makedirs(persist_dir)

# Use HuggingFace Embeddings (FREE, no API key needed)
print("Initializing HuggingFace embeddings...")
embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2",
    model_kwargs={'device': 'cpu'},
    encode_kwargs={'normalize_embeddings': True}
)

print("Testing embeddings...")
test_embedding = embeddings.embed_query("test")
print(f"✓ Embeddings working! Dimension: {len(test_embedding)}")

try:
    print(f"Creating vector store with {len(splits)} documents...")
    vectorstore = Chroma.from_documents(
        documents=splits,
        embedding=embeddings,
        persist_directory=persist_dir,
        collection_name=collection_name
    )
    print(f"✓ Index successfully built and stored with {len(splits)} chunks.")
    print(f"✓ Vector store saved to: {persist_dir}")
except Exception as e:
    print(f"Error during indexing: {str(e)}")
    import traceback

    traceback.print_exc()