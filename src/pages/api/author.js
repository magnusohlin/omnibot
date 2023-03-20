export default function handler(req, res) {
  const { method, query } = req;

  switch (method) {
    case 'GET':
      // findAuthor
      res.status(200).json({
        id: '1',
        name: 'Sample Author',
        books: ['1'],
      });
      break;
    default:
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
