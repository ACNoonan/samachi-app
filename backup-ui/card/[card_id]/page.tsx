import { CardLanding } from '@/app/components/onboarding/CardLanding'; 

// The Page component receives params asynchronously
export default function CardPage({ params }: { params: { card_id: string } }) {
  
  // Option 1 (Recommended): Render the Client Component directly.
  // The CardLanding component uses `useParams` hook which works correctly
  // on the client-side to get the card_id.
  return <CardLanding />;

  // Option 2 (If you needed card_id in the Server Component):
  // You can access the card_id directly from the passed params object.
  // const cardId = params.card_id; 
  // return (
  //   <div>
  //     <h1>Card ID (from Server Component): {cardId}</h1>
  //     {/* You would still likely render CardLanding or similar here */}
  //     {/* <CardLanding /> */} 
  //   </div>
  // );
}