'use client';

import { formUrlQuery, removeKeysFromUrlQuery } from '@jsmastery/utils';
import { useRouter,usePathname, useSearchParams } from 'next/navigation'
import React, { useEffect } from 'react'
import { useState } from 'react';

const SearchInput = () => {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    const query = searchParams.get('topic') || '';
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if(searchQuery){
            const newUrl = formUrlQuery({
                params: searchParams.toString(),
                key: 'topic',
                value: searchQuery,
            })
            router.push(newUrl,{scroll: false})
        }
        else {
            if(pathname === '/companions'){
                const newUrl = removeKeysFromUrlQuery({params: searchParams.toString(),
                    keysToRemove: ['topic']
                });
                router.push(newUrl,{scroll: false});
            }
        }
        }, 500 )
        

    },[searchQuery,router,searchParams,pathname])
    

  return (
    <div className='relative border border-black rounded-lg items-center flex gap-2 px-2 py-1 h-fit'>
        <img src="/icons/search.svg" width={15} height={15} alt="search" />
        <input type="" placeholder='Search Companions' className='outline-none' value={searchQuery} onChange={(e)=> setSearchQuery(e.target.value)} />
    </div>
  )
}

export default SearchInput