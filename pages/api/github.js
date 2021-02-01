// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import crypto from 'crypto';
import MemoryStore from '../../lib/store';

const store = new MemoryStore();
const secret = crypto.createHmac('sha256', '#66T6zMk!kxz&m#y7X').digest('hex');

export default async (req, res) => {
  if (req.headers['x-github-event'] !== secret) {
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
