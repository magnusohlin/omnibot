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
      return { data: data.answer }

    case 'createAuthor':
      return await axios.post(`${apiBase}/authors`, { author: { name: data.name }});

    case 'deleteAuthor':
      const authorToDelete = await searchAuthorByName(data.name);
      return await axios.delete(`${apiBase}/authors/${authorToDelete._id}`);

    case 'findAuthor':
      const author = await searchAuthorByName(data.name);
      return { data: author }

    case 'getAuthor':
      const authorToGet = await searchAuthorByName(data.name);
      return await axios.get(`${apiBase}/authors/${authorToGet._id}`);

    case 'searchAuthors':
      return await axios.get(`${apiBase}/authors`, { params: data });

    case 'updateAuthor':
      const authorToUpdate = await searchAuthorByName(data.name);
      console.log(data.updates)
      return await axios.put(`${apiBase}/authors/${authorToUpdate._id}`, { author: { ...data.updates } });

    case 'addBookToAuthor':
      const authorToAddBook = await searchAuthorByName(data.name);
      return await axios.post(`${apiBase}/authors/${authorToAddBook._id}/books`, { book: data.books[0] });

    case 'addBooksToAuthor':
      const authorToAddBooks = await searchAuthorByName(data.name);
      return await axios.post(`${apiBase}/authors/${authorToAddBooks._id}/books/batch`, { books: data.books });

    case 'findBook':
      return await axios.get(`${apiBase}/books/search`, { params: { name: data.title } });

    case 'getBook':
      const bookToGet = await axios.get(`${apiBase}/books/search`, { params: { name: data.title } });
      return await axios.get(`${apiBase}/books/${bookToGet.data[0]._id}`);

    case 'removeBooksFromAuthor':
      const authorToRemoveBooks = await searchAuthorByName(data.authorName);
      return await axios.delete(`${apiBase}/authors/${authorToRemoveBooks._id}/books`, { params: data });

    case 'searchBooks':
      return await axios.get(`${apiBase}/books`, { params: data });

    case 'getBooksForAuthor':
      const authorToGetBooks = await searchAuthorByName(data.name);
      return await axios.get(`${apiBase}/authors/${authorToGetBooks._id}/books`);

    case 'updateBook':
      const bookToUpdate = await axios.get(`${apiBase}/books/search`, { params: { name: data.title } });
      return await axios.put(`${apiBase}/books/${bookToUpdate.data[0]._id}`, { book: data.books[0] });

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
