import { useState, useEffect } from 'react'
import { getAllUrls, getAnalytics } from '../../services/api'
import ClicksChart from '../Analytics/ClicksChart'
import './UrlsList.css'

const PAGE_SIZE = 2

export default function UrlsList() {
    const [urls, setUrls] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [nextPage, setNextPage] = useState(null)
    const [previousPage, setPreviousPage] = useState(null)
    const [totalCount, setTotalCount] = useState(0)

    //states to track open analytics card
    const [openAnalyticsId, setOpenAnalyticsId] = useState(null)
    const [analyticsData, setAnalyticsData] = useState({})
    const [analyticsLoading, setAnalyticsLoading] = useState(null)
    const [analyticsError, setAnalyticsError] = useState({})

    const fetchUrls = async (pageNumber = 1) => {
        setLoading(true)
        setError(null)
        try {
        const data = await getAllUrls(pageNumber, PAGE_SIZE)
        setUrls(data.results)
        setNextPage(data.next)
        setPreviousPage(data.previous)
        setTotalCount(data.count)
        setCurrentPage(pageNumber)
        } catch (err) {
        setError(err.message || 'Failed to fetch URLs')
        } finally {
        setLoading(false)
        }
    }

    useEffect(() => {
        fetchUrls()
    }, [])

    const handleNextPage = () => { if (nextPage) fetchUrls(currentPage + 1) }
    const handlePreviousPage = () => { if (previousPage) fetchUrls(currentPage - 1) }

    const handleAnalyticsClick = async (url) => {
        //toggle off if alr open
        if (openAnalyticsId === url.id) {
        setOpenAnalyticsId(null)
        return
        }
        setOpenAnalyticsId(url.id)
        if (analyticsData[url.id]) return
        setAnalyticsLoading(url.id)
        setAnalyticsError(prev => ({ ...prev, [url.id]: null }))
        try {
        const data = await getAnalytics(url.shortened_url)
        setAnalyticsData(prev => ({ ...prev, [url.id]: data }))
        } catch (err) {
        setAnalyticsError(prev => ({ ...prev, [url.id]: err.error || 'Failed to load analytics' }))
        } finally {
        setAnalyticsLoading(null)
        }
    }

    const handleRefresh = async (url) => {
        setAnalyticsLoading(url.id)
        setAnalyticsError(prev => ({ ...prev, [url.id]: null }))
        try {
        const data = await getAnalytics(url.shortened_url)
        setAnalyticsData(prev => ({ ...prev, [url.id]: data }))
        } catch (err) {
        setAnalyticsError(prev => ({ ...prev, [url.id]: err.error || 'Failed to load analytics' }))
        } finally {
        setAnalyticsLoading(null)
        }
    }

    return (
        <div className="urls-list-container">
        <h2>All Shortened URLs</h2>

        {error && <p className="error">{error}</p>}
        {loading && <p className="loading">Loading...</p>}
        {!loading && urls.length === 0 && <p className="no-data">No URLs found</p>}

        {!loading && urls.length > 0 && (
            <>
            <div className="urls-grid">
                {urls.map((url) => (
                <div key={url.id} className="url-card">
                    <div className="url-info">
                    <p className="label">Original URL</p>
                    <a href={url.original_url} target="_blank" className="original-url">
                        {url.original_url}
                    </a>
                    </div>

                    <div className="url-info">
                    <p className="label">Shortened URL</p>
                    <a
                        href={`${import.meta.env.VITE_API_BASE_URL}/api/r/${url.shortened_url}`}
                        target="_blank"
                        className="short-url"
                    >
                        {`${url.shortened_url}`}
                    </a>
                    </div>

                    <div className="url-meta">
                    <span className="date">Created: {new Date(url.created_at).toLocaleDateString()}</span>
                    </div>

                    <div className="url-card-actions">
                    <button
                        className={`analytics-toggle-btn ${openAnalyticsId === url.id ? 'active' : ''}`}
                        onClick={() => handleAnalyticsClick(url)}
                    >
                        {openAnalyticsId === url.id ? '▲ Hide Analytics' : '📊 Analytics'}
                    </button>
                    </div>

                    {openAnalyticsId === url.id && (
                    <div className="inline-analytics">
                        <div className="inline-analytics-header">
                        <span>Last 7 days</span>
                        <button
                            type="button"
                            className="inline-refresh-btn"
                            onClick={() => handleRefresh(url)}
                            disabled={analyticsLoading === url.id}
                        >
                            {analyticsLoading === url.id ? 'Loading...' : '↻ Refresh'}
                        </button>
                        </div>

                        {analyticsError[url.id] && (
                        <p className="analytics-inline-error">{analyticsError[url.id]}</p>
                        )}

                        {analyticsLoading === url.id && (
                        <p className="analytics-inline-loading">Loading chart...</p>
                        )}

                        {analyticsData[url.id] && analyticsLoading !== url.id && (
                        <>
                            <p className="analytics-inline-total">
                            Total clicks: <strong>{analyticsData[url.id].total_clicks_7d}</strong>
                            </p>
                            <div className="analytics-inline-chart">
                            <ClicksChart
                                clicks={analyticsData[url.id].clicks}
                                originalUrl={analyticsData[url.id].original_url}
                            />
                            </div>
                        </>
                        )}
                    </div>
                    )}
                </div>
                ))}
            </div>

            <div className="pagination">
                <button onClick={handlePreviousPage} disabled={!previousPage} className="pagination-btn">
                ← Previous
                </button>
                <span className="pagination-info">
                Page {currentPage} of {Math.ceil(totalCount / PAGE_SIZE)}
                </span>
                <button onClick={handleNextPage} disabled={!nextPage} className="pagination-btn">
                Next →
                </button>
            </div>
            </>
        )}
        </div>
    )
    }