import { redirect } from 'next/navigation'

import { stripe } from '../../lib/stripe'

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000"

export default async function Success({ searchParams }:{
    searchParams : Promise<{ session_id ?: string}>
}) {
  const { session_id } = await searchParams

  if (!session_id)
    throw new Error('Please provide a valid session_id (`cs_test_...`)')

  const {
    status,
    customer_email,
    payment_intent,
    metadata,
    payment_status,
  } = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ['line_items', 'payment_intent']
  })

  if (status === 'open') {
    return redirect('/')
  }

  if (status === 'complete' && payment_status === 'paid') {
    const res = await fetch(`${BASE_URL}/payment/chackout-verify`,{
        method: 'POST',
        headers:{
           "Content-Type": "application/json",
        },
        body: JSON.stringify({session_id}),
    })
    const result = await res.json()
    console.log(result);
    return (
      <section id="success">
        <p>
          We appreciate your business! A confirmation email will be sent to{' '}
          {customer_email}. If you have any questions, please email{' '}
          <a href="mailto:orders@example.com">orders@example.com</a>.
        </p>
      </section>
    )
  }
}