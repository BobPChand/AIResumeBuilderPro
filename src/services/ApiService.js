const BASE_URL = 'https://superagent-02ccfade.base44.app/functions';

export async function generateResume({ profile, job_title, job_description }) {
  const res = await fetch(`${BASE_URL}/resumeGenerate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mode: 'resume', profile, job_title, job_description }),
  });
  return res.json();
}

export async function generateCoverLetter({ profile, job_title, company_name, job_description, tone }) {
  const res = await fetch(`${BASE_URL}/resumeGenerate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mode: 'cover_letter', profile, job_title, company_name, job_description, tone }),
  });
  return res.json();
}

export async function startCheckout({ plan, email }) {
  const res = await fetch(`${BASE_URL}/resumeCheckout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ plan, email }),
  });
  return res.json();
}
