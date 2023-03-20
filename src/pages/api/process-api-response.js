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
    case 'createAuthor':
      return await axios.post(`${apiBase}/authors`, data);

    case 'deleteAuthor':
      const authorToDelete = await searchAuthorByName(data.name);
      return await axios.delete(`${apiBase}/authors/${authorToDelete.id}`);

    case 'findAuthor':
      return await axios.get(`${apiBase}/authors/search`, { params: data });

    case 'getAuthor':
      const authorToGet = await searchAuthorByName(data);
      return await axios.get(`${apiBase}/authors/${authorToGet.id}`);

    case 'searchAuthors':
      return await axios.get(`${apiBase}/authors`, { params: data });

    case 'updateAuthor':
      const authorToUpdate = await searchAuthorByName(data.name);
      return await axios.put(`${apiBase}/authors/${authorToUpdate.id}`, data);

    case 'addBookToAuthor':
      const authorToAddBook = await searchAuthorByName(data.name);
      return await axios.post(`${apiBase}/authors/${authorToAddBook.id}/books`, { book: data.book });

    case 'addBooksToAuthor':
      const authorToAddBooks = await searchAuthorByName(data.name);
      return await axios.post(`${apiBase}/authors/${authorToAddBooks.id}/books/batch`, { books: data.books });

    case 'findBook':
      return await axios.get(`${apiBase}/books/search`, { params: data });

    case 'getBook':
      const bookToGet = await axios.get(`${apiBase}/books/search`, { params: { title: data.title } });
      return await axios.get(`${apiBase}/books/${bookToGet.data[0].id}`);

    case 'removeBooksFromAuthor':
      const authorToRemoveBooks = await searchAuthorByName(data.authorName);
      return await axios.delete(`${apiBase}/authors/${authorToRemoveBooks.id}/books`, { params: data });

    case 'searchBooks':
      return await axios.get(`${apiBase}/books`, { params: data });

    case 'getBooksForAuthor':
      const authorToGetBooks = await searchAuthorByName(data.name);
      return await axios.get(`${apiBase}/authors/${authorToGetBooks.id}/books`);

    case 'updateBook':
      const bookToUpdate = await axios.get(`${apiBase}/books/search`, { params: { title: data.title } });
      return await axios.put(`${apiBase}/books/${bookToUpdate.data[0].id}`, data);

    default:
      throw new Error(`Unsupported action: ${action}`);
  }
}

export default async (req, res) => {
  try {
    const rawApiResponse = req.body;
    const apiResponse = await processApiResponse(rawApiResponse);
    res.status(200).json(apiResponse.data);
  } catch (error) {
    console.error("Error:", error);
    console.error("Error Message:", error.message);
    console.error("Error Stack:", error.stack);
    res.status(500).json({ message: "An error occurred while processing the API response" });
  }
};
