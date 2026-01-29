'use client';

import { useState } from 'react';
import Image from 'next/image';
import EmptyState from '@/components/ui/EmptyState';

type BlockedUser = {
  id: number;
  name: string;
  profileImage?: string;
};

export default function BlockedListPage() {
  const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([
    { id: 1, name: '짱구', profileImage: '/favicon.ico' },
    { id: 2, name: '신형만' },  // 프사 없음
    { id: 3, name: '봉미선', profileImage: '/favicon.ico' },
    { id: 4, name: '짱아' },  // 프사 없음
    { id: 5, name: '맹구', profileImage: '/favicon.ico' },
    { id: 6, name: '훈이' },  // 프사 없음
    { id: 7, name: '철수', profileImage: '/favicon.ico' },
    { id: 8, name: '유리' },  // 프사 없음
  ]);

  const handleUnblock = (userId: number) => {
    console.log('차단 해제:', userId);
    setBlockedUsers(blockedUsers.filter(user => user.id !== userId));
  };

  return (
    <div className="min-h-screen w-full bg-bg-primary pb-20">
      <div className="px-4 py-6 max-w-md mx-auto">
        {/* 차단 목록 또는 빈 상태 */}
        {blockedUsers.length > 0 ? (
          <div className="space-y-3">
            {blockedUsers.map((user) => (
              <div 
                key={user.id}
                className="flex items-center justify-between bg-white rounded-xl p-4"
              >
                {/* 프로필 */}
                <div className="flex items-center gap-3">
                  {/* 프로필 이미지 또는 없을 때 이니셜 */}
                  <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center bg-brown-accent">
                    {user.profileImage ? (
                      <Image
                        src={user.profileImage}
                        alt={user.name}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-white font-semibold text-lg">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <span className="text-base text-font-dark">{user.name}</span>
                </div>

                {/* 차단 해제 버튼 */}
                <button
                  onClick={() => handleUnblock(user.id)}
                  className="px-4 py-2 bg-brown-accent text-white text-sm rounded-lg font-medium"
                >
                  차단 해제
                </button>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState 
            title="차단한 사용자가 없습니다"
            description="차단한 사용자가 여기에 표시됩니다"
          />
        )}
      </div>
    </div>
  );
}