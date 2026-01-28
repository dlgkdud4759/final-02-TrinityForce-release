export default function LocationDenied() {
  return (
    <div className="flex items-center justify-center min-h-[60vh] px-4">
      <div className="text-center">
        
        {/* 메인 메시지 */}
        <p className="text-[20px] font-bold text-gray-dark mb-2 leading-relaxed">
          위치 권한을 허용하지 않으면
          <br />
          주변 책을 볼 수 없습니다.
        </p>

        {/* 서브 메시지 */}
        <p className="text-[14px] font-medium text-gray-medium)]">
          다른 검색어를 입력해 보세요.
        </p>
      </div>
    </div>
  );
}