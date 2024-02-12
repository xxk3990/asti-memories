import '../styles/gallery.css'
import {React, useState, useEffect, useMemo} from 'react'
import { handleGet } from '../services/requests-service'
import { GalleryTile } from './child-components/GalleryTile'
import {v4 as uuidv4} from 'uuid'
import { Pagination } from './child-components/Pagination'
export default function Gallery() {
    let PageSize = 8;
    const [gallery, setGallery] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const getImages = async () => {
        const endpoint = `gallery`
        await handleGet(endpoint, setGallery)
    }
    useEffect(() => {
        getImages()
    }, [])
    const imagesPerPage = useMemo(() => {
        const firstPageIndex = (currentPage - 1) * PageSize;
        const lastPageIndex = firstPageIndex + PageSize;
        return gallery.slice(firstPageIndex, lastPageIndex)
    }, [currentPage, gallery])
    if(gallery.length === 0) {
        return (
            <div className='Gallery'>
                <h1>Asti Images (none added yet)</h1>
                <section className='gallery-grid'>
                    
                </section>
            </div>
        )
    } else {
        return (
            <div className='Gallery'>
                <h1><em>Asti</em> Image Gallery</h1>
                <Pagination
                    className="pagination-bar"
                    currentPage={currentPage}
                    totalCount={gallery.length} 
                    pageSize={PageSize}
                    onPageChange={page => setCurrentPage(page)}
                />
                <section className='gallery-grid'>
                    {
                        imagesPerPage.map(img => {
                            return (
                                <GalleryTile key={uuidv4()} img = {img} />
                            )
                        })

                    }
                </section>
            </div>
        )
    }
    
}