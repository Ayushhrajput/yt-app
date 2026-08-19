import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { getAllVideos } from '../services/videoService';
import { useNavigate } from 'react-router-dom';
import LoaderBar from '../components/Loaders/LoaderBar.jsx';

const SearchBox = forwardRef(({user, className}) => {
    const {darkTheme} = useTheme()

    const navigate = useNavigate()

    const [videos, setVideos] = useState([])
    const [page, setPage] = useState(1)
    const [query, setQuery] = useState("")
    const [fetch, setFetch] = useState(false)
    const [hasMore, setHasMore] = useState(true)
    const [searchInput, setSearchInput] = useState("")

    const ref = useRef(null)

    
    
    

    useEffect(() => {
        if(query.trim() === ""){
            setVideos([])
            return
        }

        if(fetch) return
        
        const fetchVideos = async () => {
            try {
                setFetch(true)
                const response = await getAllVideos({
                    page,
                    query: query,
                    userId: user
                })
                const newVideos = response.data.videos
                setVideos(prev => [...prev, ...newVideos])
                if(newVideos.length < 10) {
                    setHasMore(false)
                }
            } catch (e) {
                console.error(e)
            } finally {
                setFetch(false)
            }
        }
        fetchVideos()
        
    }, [page, query])

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if(entries[0].isIntersecting && hasMore && !fetch) {
                    setPage(prev => prev + 1)
                }
            }, 
            {
                threshold: 0.7
            }
        )

        if(ref.current) observer.observe(ref.current)

        return () => observer.disconnect()
        
    }, [hasMore, fetch, page])
    
    const handleSearch = () => {
        setVideos([])
        setQuery(searchInput)
        setPage(1)
        setHasMore(true)
    }
    return (
        <div className={` ${className} flex flex-col items-center`}>
            <div className="w-full flex justify-center px-2 py-2">
                <div className={`w-full max-w-sm flex items-center ${darkTheme? "bg-black/60 border-white/20 border-t": "bg-white/60 border-black/10  border"}     backdrop-blur-2xl  rounded-full overflow-hidden`}>
                    <input 
                        type="text"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        onKeyDown={(e) => {
                            if(e.key === "Enter") {
                                handleSearch()
                            }
                        }}
                        className='flex-1 outline-none  h-full py-2 px-4' 
                        placeholder='Search'/>
                    <div 
                        onClick={() => (handleSearch())}
                        className={`  px-2`}>
                        <i class="fa-solid fa-magnifying-glass "></i>
                    </div>
                </div>
            </div>
            
            {query.trim() && videos.length === 0 && !fetch && <div className='w-full py-6 text-center'>No results found</div>}
            
            <div className='grid grid-cols-3 gap-0.5 max-w-lg'>
                {videos.map((video) => (
                    <div key={video._id}>
                        <div 
                            onClick={() => {
                                navigate(`/video/${video._id}`)
                            }}
                            className='relative w-full min-h-40  max-w-full  aspect-9/16 bg-black'
                        >
                        <img 
                            className='w-full h-full object-contain'
                            src={video.thumbnail} alt=""
                        />
                        <div className='absolute bottom-0 right-0 px-1'>
                            <div className='text-white/60 text-sm'>
                                {video.views} views
                            </div>
                        </div>
                        </div>
                    </div>
                ))}
            </div>
            {fetch && <LoaderBar className="py-4"/>}
            <div ref={ref} className=''></div>
        </div>
    );
})

export default SearchBox;