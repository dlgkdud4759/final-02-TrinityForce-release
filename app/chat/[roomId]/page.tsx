import HeaderSub from '@/components/layout/HeaderSub';
import ChatRoom from './ChatRoom';

export default async function ChattingPage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const { roomId } = await params;
  console.log(roomId);

  return (
    <>
      <HeaderSub />

      <ChatRoom roomId={roomId} />
    </>
  );
}
