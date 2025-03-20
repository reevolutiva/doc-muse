# Chat with PDF

This folder contains the implementation of a console-based chatbot that allows users to ask questions about the content of a PDF file and receive answers. The chatbot uses a combination of tools to download the PDF, build an index, and query the content using a large language model (LLM).

## Structure and Organization

### Files
- **`main.py`**: The entry point of the chatbot. It handles user input, orchestrates the flow of operations, and manages the chat history.  
  - Key functions:
    - `chat_with_pdf`: Orchestrates the process of downloading the PDF, building an index, rewriting the question, finding context, and querying the LLM.
    - `print_stream_and_return_full_answer`: Prints the streamed response from the LLM and returns the full answer.
    - `main_loop`: Manages the interactive chat loop.
    - `main`: Parses command-line arguments and starts the chatbot.

### Submodules
- **`qna.py`**: Handles querying the LLM to generate answers based on the provided context and chat history.
- **`find_context.py`**: Retrieves the most relevant context from the indexed PDF content.
- **`rewrite_question.py`**: Rewrites user questions to improve the relevance of the retrieved context.
- **`build_index.py`**: Builds a FAISS index from the content of the PDF for efficient vector-based searches.
- **`download.py`**: Downloads the PDF file from a given URL.
- **`utils/lock.py`**: Provides a locking mechanism to ensure thread-safe operations.
- **`constants.py`**: Defines constants such as directory paths for storing PDFs and indexes.

## Responsibilities

1. **PDF Downloading**: The `download.py` module fetches the PDF file from the provided URL and stores it locally.
2. **Index Building**: The `build_index.py` module processes the PDF content, splits it into chunks, generates embeddings, and stores them in a FAISS index.
3. **Context Retrieval**: The `find_context.py` module queries the FAISS index to retrieve the most relevant context for a given question.
4. **Question Rewriting**: The `rewrite_question.py` module uses an LLM to rewrite user questions for better context matching.
5. **Answer Generation**: The `qna.py` module interacts with the LLM to generate answers based on the retrieved context and chat history.
6. **Chat Management**: The `main.py` module manages the chat loop, user input, and chat history.

## How It Works

1. The user provides a URL to a PDF file and asks a question.
2. The chatbot downloads the PDF and builds an index of its content.
3. The user's question is rewritten to improve relevance.
4. The rewritten question is used to query the index and retrieve the most relevant context.
5. The context and chat history are sent to the LLM to generate an answer.
6. The answer is displayed to the user, and the chat history is updated.

## Notes

- Ensure that the `.env` file is properly configured with the necessary environment variables, such as API keys and model deployment names.
- The chatbot uses FAISS for vector-based indexing and OpenAI's API for LLM interactions.
- For more details on the individual modules, refer to their respective documentation or inline comments.

## References

- [Find Context Module](chat_with_pdf/find_context.py)
- [Rewrite Question Module](chat_with_pdf/rewrite_question.py)
- [Build Index Module](chat_with_pdf/build_index.py)
- [Download Module](chat_with_pdf/download.py)
- [QnA Module](chat_with_pdf/qna.py)