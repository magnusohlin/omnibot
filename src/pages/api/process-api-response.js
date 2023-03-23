import axios from "axios";

async function processApiResponse(apiResponse) {
  const { action, data } = apiResponse;

  const apiBase = 'http://ec2-34-240-195-150.eu-west-1.compute.amazonaws.com:5001'

  const searchAuthorByName = async (name) => {
    const response = await axios.get(`${apiBase}/authors`, {
      params: {
        name,
      },
    });
    return response.data[0];
  };

  switch (action) {
    case 'generalQuestion':
      return { type: 'plainText', data: data.answer }

    case 'createAuthor':
      const createdAuthor = await axios.post(`${apiBase}/authors`, { author: { name: data.name }});
      return { type: 'plainText', data: createdAuthor.data };

    case 'deleteAuthor':
      const authorToDelete = await searchAuthorByName(data.name);
      await axios.delete(`${apiBase}/authors/${authorToDelete._id}`);
      return { type: 'plainText', data: 'Author deleted successfully.' };

    case 'findAuthor':
      const author = await searchAuthorByName(data.name);
      return { type: 'plainText', data: author };

    case 'getAuthor':
      const authorToGet = await searchAuthorByName(data.name);
      const authorDetails = await axios.get(`${apiBase}/authors/${authorToGet._id}`);
      return { type: 'plainText', data: authorDetails.data };

    case 'searchAuthors':
      const authors = await axios.get(`${apiBase}/authors`, { params: data });
      return { type: 'table', data: authors.data };

    case 'reportAuthors':
      const authorsData = await axios.get(`${apiBase}/authors`, { params: data });
      return { type: 'chart', data: authorsData.data };

    case 'updateAuthor':
      const authorToUpdate = await searchAuthorByName(data.name);
      const updatedAuthor = await axios.put(`${apiBase}/authors/${authorToUpdate._id}`, { author: { ...data.updates } });
      return { type: 'plainText', data: updatedAuthor.data };

    case 'addBookToAuthor':
      const authorToAddBook = await searchAuthorByName(data.name);
      const addedBook = await axios.post(`${apiBase}/authors/${authorToAddBook._id}/books`, { book: data.books[0] });
      return { type: 'plainText', data: addedBook.data };

    case 'addBooksToAuthor':
      const authorToAddBooks = await searchAuthorByName(data.name);
      const addedBooks = await axios.post(`${apiBase}/authors/${authorToAddBooks._id}/books/batch`, { books: data.books });
      return { type: 'plainText', data: addedBooks.data };

    case 'findBook':
      const foundBook = await axios.get(`${apiBase}/books/search`, { params: { name: data.title } });
      return { type: 'plainText', data: foundBook.data };

    case 'getBook':
      const bookToGet = await axios.get(`${apiBase}/books/search`, { params: { name: data.title } });
      const bookDetails = await axios.get(`${apiBase}/books/${bookToGet.data[0]._id}`);
      return { type: 'plainText', data: bookDetails.data };

    case 'removeBooksFromAuthor':
      const authorToRemoveBooks = await searchAuthorByName(data.authorName);
      await axios.delete(`${apiBase}/authors/${authorToRemoveBooks._id}/books`, { params: data });
      return { type: 'plainText', data: 'Books removed successfully.' };

    case 'searchBooks':
      const searchedBooks = await axios.get(`${apiBase}/books`, { params: data });
      return { type: 'table', data: searchedBooks.data };

    case 'getBooksForAuthor':
      const authorToGetBooks = await searchAuthorByName(data.name);
      const authorBooks = await axios.get(`${apiBase}/authors/${authorToGetBooks._id}/books`);
      return { type: 'table', data: authorBooks.data };

    case 'updateBook':
      const bookToUpdate = await axios.get(`${apiBase}/books/search`, { params: { name: data.title } });
      const updatedBook = await axios.put(`${apiBase}/books/${bookToUpdate.data[0]._id}`, { book: data.books[0] });
      return { type: 'plainText', data: updatedBook.data };

    default:
      throw new Error(`Unsupported action: ${action}`);
  }
}

export default async (req, res) => {
  try {
    const rawApiResponse = req.body;
    const apiResponse = await processApiResponse(rawApiResponse);
    res.status(200).json(apiResponse);
  } catch (error) {
    console.error("Error:", error);
    console.error("Error Message:", error.message);
    console.error("Error Stack:", error.stack);
    res.status(500).json({ message: "An error occurred while processing the API response" });
  }
};
