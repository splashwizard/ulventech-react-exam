// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'


export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.status(405).send({ message: 'Only POST requests allowed' })
    return
  }
  fetch('https://ulventech-react-exam.netlify.app/api/form', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(req.body)
  })
  .then(response => response.json())
  .then(response => {
    res.status(200).json(response);
  })
  .catch((error) => {
    console.error('Error:', error);
    res.status(500).json(error);
  });
}
