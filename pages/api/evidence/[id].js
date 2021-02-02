import util from 'util';
import stream from 'stream';
import store from '../../../lib/store';
import { saveEvidence } from '../github';

const pipeline = util.promisify(stream.pipeline);

export default async function(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).end();
  }

  const { id } = req.query;
  
  // await saveEvidence(id, 'http://google.com'); 
  const stream = await store.getDownloadEvidenceStream(id);
  try {
    await pipeline(stream, res);
    res.writeHead(200, { 'Content-Type': 'image/png' });  
  } catch (error) {
    return res.status(500).end();
  }  
}