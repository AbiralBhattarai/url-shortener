import { useState, useEffect } from "react";
import { shortenUrl } from "../../services/api";
import "./UrlForm.css";

export default function UrlForm(){
    const [originalUrl,setOriginalUrl] = useState('')
    const [shortenedUrl,setShortenedUrl] = useState(null)
    const [loading,setLoading] = useState(false)
    const [error,setError] = useState(null)
    const [retryAfter,setRetryAfter] = useState(null)

    useEffect(() => {
        if (retryAfter === null) return
        if (retryAfter <= 0) {
            setRetryAfter(null)
            setError(null)
            return
        }
        const timer = setTimeout(() => {
            setRetryAfter(prev => prev - 1)
        }, 1000)
        return () => clearTimeout(timer)
    }, [retryAfter])

    const handleSubmit = async(e) =>{
        e.preventDefault()
        setLoading(true)
        setError(null)
        setShortenedUrl(null)

        try{
            const response = await shortenUrl(originalUrl)
            setShortenedUrl(response.shortened_url)
            setOriginalUrl('')
        }catch(err){
            console.error("Error:", err)
            if (err.status === 429) {
                setRetryAfter(err.retry_after||60)
                setError('Rate limit exceeded.')
            } else {
                setError(err.error || err.message || 'Failed to shorten URL')
            }
        }finally{
            setLoading(false)
        }
    }

    return(
        <>
        <div className="home">
            <h1>URL Shortener</h1>
            <form onSubmit={handleSubmit}>
                <input type='url' placeholder="Enter URL" value={originalUrl} onChange={(e)=>setOriginalUrl(e.target.value)} required/>
                <button type='submit' disabled={loading || retryAfter !== null}>
                    {loading ? "Shortening..." : "Shorten URL"}
                </button>
            </form>

            {error && <p className='error'>{error}</p>}

            {retryAfter !== null && (
                <div className='countdown'>
                    <span className='countdown-clock'>
                        {`${retryAfter}s`}
                    </span>
                    <p>Try again when the timer ends</p>
                </div>
            )}

            {shortenedUrl && (
            <div className="result">
                <p>Shortened URL: <a href={`${import.meta.env.VITE_API_BASE_URL}/api/r/${shortenedUrl}`} target="_blank"><strong>{`${import.meta.env.VITE_API_BASE_URL}/${shortenedUrl}`}</strong></a></p>
            </div>
)}
        </div>
        </>
    )
}