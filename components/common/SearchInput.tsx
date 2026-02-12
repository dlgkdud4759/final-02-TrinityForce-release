"use client"

import { useState } from "react"
import { SearchIcon } from "@/app/components/icons/Search"

type SearchInputProps = {
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSearch?: (value: string, category: string) => void
  onFocus?: () => void
  onBlur?: () => void
  placeholder?: string
  categories?: string[]  // ["공통", "책제목", "저자" 등]
  showCategory?: boolean
}

export default function SearchInput({
  value = "",
  onChange,
  onSearch,
  onFocus,
  onBlur,
  placeholder = "검색어를 입력하세요",
  categories = ["전체", "과학", "인문학", "사회과학", "예술", "수험서", "자기계발", "소설", "참고서", "어린이"],
  showCategory = true
}: SearchInputProps) {
  const [selectedCategory, setSelectedCategory] = useState(categories[0])

  const handleSearch = () => {
    if (onSearch) {
      onSearch(value, selectedCategory)
    }
  }
    
  // enter
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }


  return (
    <div className="relative w-full max-w-[680px] h-[40px] flex items-center bg-white rounded-[30px] border border-brown-accent">
      {/* 카테고리 드롭다운 */}
      {showCategory && (
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 bg-transparent text-sm text-font-dark"
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      )}

      {/* 검색 입력 */}
      <input
        type="text"
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="flex-1 px-3 text-sm text-font-dark placeholder:text-gray-dark bg-transparent outline-none"
      />

      {/* 검색 아이콘 버튼 */}
      <button
        onClick={handleSearch}
        className="px-3 text-brown-accent cursor-pointer"
        aria-label="검색"
      >
        <SearchIcon className="w-4 h-4"/>
      </button>
    </div>
  )
}