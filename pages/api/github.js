// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import crypto from 'crypto';
import request from 'request';
import { once } from 'events';
import store from '../../lib/store';
import { takeScreenshot } from '../../lib/screenshot';

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
    const evidenceId = await saveEvidence(body.pull_request.id, body.pull_request.html_url);
    const pullRequest = { 
      source: 'github',
      title: body.pull_request.title,
      action: body.action,
      externalId: body.pull_request.id,      
      merged_at: body.pull_request.merged_at,
      merged_by: body.pull_request.merged_by.login,
      html_url: body.pull_request.html_url,
      _raw: body,
      evidenceId,
    }
    await store.closePullRequest(pullRequest);    
  }
  res.status(200).json({ name: 'Github', status: 'Ok' });
}

export async function saveEvidence(id, html_url) {
  // const buffer = await takeScreenshot(html_url);
  const uploadStream = await store.getUploadEvidenceStream(id);
  // uploadStream.write(buffer);
  // uploadStream.end();

  const r = request
    .get(`https://screenshotapi.net/api/v1/screenshot?token=${process.env.SCREENSHOT_APIKEY}&full_page=true&output=image&url=${html_url}`)
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
    await once(r, 'end');

    return uploadStream.id.toHexString();
}
