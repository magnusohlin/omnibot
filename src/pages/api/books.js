export default function handler(req, res) {
  const { method, query } = req;

  switch (method) {
    case 'GET':
      // searchBooks
      res.status(200).json([
        {
          id: '1',
          title: 'Sample Book 1',
          authorId: '1',
        },
        {
          id: '2',
          title: 'Sample Book 2',
          authorId: '2',
        },
      ]);
      break;
    case 'POST':
      // addBookToAuthor
      res.status(201).json({
        id: '3',
        title: 'New Sample Book',
        authorId: '1',
      });
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
