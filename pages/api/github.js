// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import crypto from 'crypto';
import request from 'request';
import { once } from 'events';
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
      title: body.pull_request.title,
      action: body.action,
      externalId: body.pull_request.id,      
      merged_at: body.pull_request.merged_at,
      merged_by: body.pull_request.merged_by.login,
      html_url: body.pull_request.html_url,
      _raw: body,
    }
    await Promise.all([
      store.closePullRequest(pullRequest),
      saveEvidence(pullRequest.externalId, pullRequest.html_url),
    ])
  }
  res.status(200).json({ name: 'Github', status: 'Ok' });
}

async function saveEvidence(id, html_url) {
  const uploadStream = await store.getUploadEvidenceStream(id);
  const r = request
    .get(`http://localhost:8080/?type=screenshot&fullPage=true&url=${html_url}`)
    .on('response', function(response) {
      console.log(response.statusCode)
      console.log(response.headers['content-type'])
    })
    .on('data', function(chunk) {
      uploadStream.write(chunk)
    })
    .on('end', function() {
      uploadStream.end();
    })
    return once(r, 'end');
}
