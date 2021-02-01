// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import store from '../../lib/store';

export default async function(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).end();
  }

  const pull_requests = await store.getPullRequests();
  res.status(200).json({ pull_requests }); 
}