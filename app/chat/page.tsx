import HeaderSub from '@/components/layout/HeaderSub';
import NavigationBar from '@/components/layout/Navigation';
import ChatList from './ChatList';

export default function ChatPage() {
  return (
    <>
      <HeaderSub />

      <ChatList />

      <NavigationBar />
    </>
  );
}
