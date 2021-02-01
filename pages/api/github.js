// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import crypto from 'crypto';
import store from '../../lib/store';

function calculatePayloadSignature(body) {
  const signature = crypto
    .createHmac('sha256', process.env.GITHUB_WEBHOOK_SECRET)
    .update(JSON.stringify(body))
    .digest('hex');
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
      title: body.title,
      action: body.action,
      externalId: body.pull_request.id,      
      merged_at: body.pull_request.merged_at,
      merged_by: body.pull_request.merged_by.login,
      html_url: body.pull_request.html_url,
      _raw: body,
    }
    await store.closePullRequest(pullRequest);

  }
  res.status(200).json({ name: 'Github', status: 'Ok' });
}
