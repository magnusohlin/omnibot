export default function handler(req, res) {
  const { method, query, body } = req;

  switch (method) {
    case 'GET':
      // searchAuthors or getBooksForAuthor
      res.status(200).json([
        {
          id: '1',
          name: 'Sample Author 1',
          books: ['1'],
        },
        {
          id: '2',
          name: 'Sample Author 2',
          books: ['2'],
        },
      ]);
      break;
    case 'POST':
      // createAuthor
      res.status(201).json({
        id: '3',
        name: 'New Sample Author',
        books: [],
      });
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
