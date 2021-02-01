// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import crypto from 'crypto';
import MemoryStore from '../../lib/store';

const secret = 'UYTlk9Hdybmq5LUMzC';
const store = new MemoryStore();

function calculatePayloadSignature(payload) {
  return crypto.createHmac('sha256', secret).update(payload).digest('hex');
}

export default async (req, res) => {
  const signature = calculatePayloadSignature(req.body.payload);
  if (req.headers['x-hub-signature-256'] !== `sha256=${signature}`) {
    return res.status(500).json({ message: 'Bad secret' });
  }
  const parsedPayload = JSON.parse(req.body.payload);
  if (req.headers['x-github-event'] === 'pull_request' && parsedPayload.action === 'closed') {
    const pullRequest = { 
      source: 'github',
      action: parsedPayload.action,
      externalId: parsedPayload.pull_request.id,      
      merged_at: parsedPayload.pull_request.merged_at,
      merged_by: parsedPayload.pull_request.merged_by.login,
      html_url: parsedPayload.pull_request.html_url
    }
    await store.closePullRequest(pullRequest);

  }
  res.status(200).json({ name: 'Github', status: 'Ok' });
}
