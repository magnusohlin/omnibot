export default function handler(req, res) {
  const { method, query } = req;

  switch (method) {
    case 'GET':
      // findBook
      res.status(200).json({
        id: '1',
        title: 'Sample Book',
        authorId: '1',
      });
      break;
    default:
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
