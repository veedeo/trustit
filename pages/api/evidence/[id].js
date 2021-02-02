import store from '../../../lib/store';

export default async function(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).end();
  }

  const { id } = req.query;
  const stream = await store.getDownloadEvidenceStream(id);
  res.writeHead(200, { 'Content-Type': 'image/png' });
  stream.pipe(res);
}