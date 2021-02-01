// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import crypto from 'crypto';
import MemoryStore from '../../lib/store';

const secret = 'UYTlk9Hdybmq5LUMzC';
const store = new MemoryStore();

function calculatePayloadSignature(body) {
  const signature = crypto.createHmac('sha256', secret).update(body).digest('hex');
  return `sha256=${signature}`;
}

export default async (req, res) => {
  const { body } = req;
  const signature = calculatePayloadSignature(body);
  if (req.headers['x-hub-signature-256'] !== signature) {
    return res.status(500).json({ message: 'Bad signature' });
  }

  if (req.headers['x-github-event'] === 'pull_request' && body.action === 'closed') {
    const pullRequest = { 
      source: 'github',
      action: body.action,
      externalId: body.pull_request.id,      
      merged_at: body.pull_request.merged_at,
      merged_by: body.pull_request.merged_by.login,
      html_url: body.pull_request.html_url
    }
    await store.closePullRequest(pullRequest);

  }
  res.status(200).json({ name: 'Github', status: 'Ok' });
}
