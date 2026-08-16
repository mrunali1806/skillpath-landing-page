//testing comment
import { useState, useEffect } from "react"
import { addPropertyControls, ControlType } from "framer"

export default function SkillpathCourses(props) {
    const { accentColor, cardRadius } = props

    // Course API states
    const [courses, setCourses] = useState(null)
    const [courseError, setCourseError] = useState(false)

    // Country API states
    const [countryCode, setCountryCode] = useState(null)
    const [countryError, setCountryError] = useState(false)
    const [countryLoading, setCountryLoading] = useState(true)

    // Search and sort states
    const [searchText, setSearchText] = useState("")
    const [sortOrder, setSortOrder] = useState("none")

    // Fetch both APIs
    function fetchData() {
        setCourses(null)
        setCourseError(false)
        setCountryCode(null)
        setCountryError(false)
        setCountryLoading(true)

        // Course API
        fetch("https://syncsphere-hiv6.onrender.com/assignment/course-data")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Course request failed")
                }

                return response.json()
            })
            .then((data) => {
                setCourses(Array.isArray(data) ? data : [])
            })
            .catch(() => {
                setCourseError(true)
            })

        // Country API
        fetch("https://syncsphere-hiv6.onrender.com/assignment/country-code")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Country request failed")
                }

                return response.json()
            })
            .then((data) => {
                setCountryCode(data.country_code)
                setCountryLoading(false)
            })
            .catch(() => {
                setCountryError(true)
                setCountryLoading(false)
            })
    }

    // Run APIs when component loads
    useEffect(() => {
        fetchData()
    }, [])

    // Convert API price into correct currency
    function formatPrice(course) {
        // Do not guess currency if country API fails
        if (countryError || !countryCode) {
            return "Price unavailable"
        }

        // IN = paise to rupees
        if (countryCode === "IN") {
            const rupees = course.pricePaise / 100

            return `₹${rupees.toLocaleString("en-IN")}`
        }

        // US = cents to dollars
        if (countryCode === "US") {
            const dollars = course.priceUsdCents / 100

            return `$${dollars.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            })}`
        }

        return "Price unavailable"
    }

    // Numeric value used for sorting
    function getComparablePrice(course) {
        if (countryCode === "IN") {
            return course.pricePaise
        }

        if (countryCode === "US") {
            return course.priceUsdCents
        }

        return 0
    }

    // Skeleton card
    function SkeletonCard() {
        return (
            <div
                style={{
                    padding: 20,
                    border: "1px solid #eeeeee",
                    borderRadius: cardRadius,
                    minHeight: 220,
                    boxSizing: "border-box",
                    background: "#f5f5f5",
                }}
            >
                <div
                    style={{
                        width: "40%",
                        height: 10,
                        background: "#dddddd",
                        borderRadius: 4,
                        marginBottom: 16,
                    }}
                />

                <div
                    style={{
                        width: "75%",
                        height: 18,
                        background: "#dddddd",
                        borderRadius: 4,
                        marginBottom: 14,
                    }}
                />

                <div
                    style={{
                        width: "100%",
                        height: 10,
                        background: "#dddddd",
                        borderRadius: 4,
                        marginBottom: 8,
                    }}
                />

                <div
                    style={{
                        width: "60%",
                        height: 10,
                        background: "#dddddd",
                        borderRadius: 4,
                    }}
                />
            </div>
        )
    }

    // -----------------------------
    // LOADING
    // -----------------------------

    if (courses === null && !courseError) {
        return (
            <div
                style={{
                    width: "100%",
                    padding: 20,
                    boxSizing: "border-box",
                }}
            >
                <div className="skillpath-grid">
                    {[1, 2, 3].map((item) => (
                        <SkeletonCard key={item} />
                    ))}
                </div>

                <style>
                    {`
                        .skillpath-grid {
                            display: grid;
                            grid-template-columns: repeat(3, minmax(0, 1fr));
                            gap: 20px;
                        }
                        @media (max-width: 1024px) {
                            .skillpath-grid {
                                grid-template-columns: repeat(2, minmax(0, 1fr));
                            }
                        }
                        @media (max-width: 600px) {
                            .skillpath-grid {
                                grid-template-columns: 1fr;
                            }
                        }
                    `}
                </style>
            </div>
        )
    }

    // -----------------------------
    // COURSE API ERROR
    // -----------------------------

    if (courseError) {
        return (
            <div
                style={{
                    padding: 40,
                    textAlign: "center",
                    fontFamily: "Inter, sans-serif",
                }}
            >
                <div
                    style={{
                        fontSize: 18,
                        fontWeight: 700,
                        color: "#222",
                        marginBottom: 8,
                    }}
                >
                    Couldn't load courses
                </div>

                <div
                    style={{
                        fontSize: 14,
                        color: "#777",
                        marginBottom: 18,
                    }}
                >
                    Something went wrong while loading the courses.
                </div>

                <button
                    onClick={fetchData}
                    style={{
                        padding: "10px 18px",
                        borderRadius: 8,
                        border: "none",
                        background: accentColor,
                        color: "#ffffff",
                        fontWeight: 600,
                        cursor: "pointer",
                    }}
                >
                    Try again
                </button>
            </div>
        )
    }

    // -----------------------------
    // ZERO RESULTS
    // -----------------------------

    if (!courses || courses.length === 0) {
        return (
            <div
                style={{
                    padding: 40,
                    textAlign: "center",
                    color: "#777",
                    fontFamily: "Inter, sans-serif",
                }}
            >
                <div
                    style={{
                        fontSize: 18,
                        fontWeight: 700,
                        color: "#222",
                        marginBottom: 8,
                    }}
                >
                    No courses available
                </div>

                <div style={{ fontSize: 14 }}>
                    Please check back again soon.
                </div>
            </div>
        )
    }

    // -----------------------------
    // SEARCH
    // -----------------------------

    let filteredCourses = courses.filter((course) =>
        course.courseName.toLowerCase().includes(searchText.toLowerCase())
    )

    // -----------------------------
    // SORT
    // -----------------------------

    if (sortOrder === "lowToHigh") {
        filteredCourses = [...filteredCourses].sort(
            (a, b) => getComparablePrice(a) - getComparablePrice(b)
        )
    }

    if (sortOrder === "highToLow") {
        filteredCourses = [...filteredCourses].sort(
            (a, b) => getComparablePrice(b) - getComparablePrice(a)
        )
    }

    // -----------------------------
    // MAIN UI
    // -----------------------------

    return (
        <div
            style={{
                width: "100%",
                padding: 20,
                boxSizing: "border-box",
                fontFamily: "Inter, sans-serif",
            }}
        >
            {/* Country API warning */}
            {countryError && (
                <div
                    style={{
                        marginBottom: 16,
                        padding: "10px 14px",
                        borderRadius: 8,
                        background: "#FFF8E7",
                        color: "#795900",
                        fontSize: 13,
                        textAlign: "center",
                    }}
                >
                    We couldn't determine your currency. Prices are temporarily
                    unavailable.
                </div>
            )}

            {/* Search and Sort */}
            <div
                style={{
                    display: "flex",
                    gap: 12,
                    marginBottom: 20,
                    flexWrap: "wrap",
                }}
            >
                <input
                    type="text"
                    placeholder="Search courses..."
                    value={searchText}
                    onChange={(event) => setSearchText(event.target.value)}
                    style={{
                        flex: 1,
                        minWidth: 200,
                        padding: "11px 14px",
                        borderRadius: 8,
                        border: "1px solid #dddddd",
                        fontSize: 14,
                        outline: "none",
                    }}
                />

                <select
                    value={sortOrder}
                    onChange={(event) => setSortOrder(event.target.value)}
                    style={{
                        padding: "11px 14px",
                        borderRadius: 8,
                        border: "1px solid #dddddd",
                        fontSize: 14,
                        background: "#ffffff",
                    }}
                >
                    <option value="none">Sort by price</option>
                    <option value="lowToHigh">Price: Low to High</option>
                    <option value="highToLow">Price: High to Low</option>
                </select>
            </div>

            {/* Search empty state */}
            {filteredCourses.length === 0 ? (
                <div
                    style={{
                        padding: 40,
                        textAlign: "center",
                        color: "#777",
                    }}
                >
                    No courses match your search.
                </div>
            ) : (
                <div className="skillpath-grid">
                    {filteredCourses.map((course) => (
                        <div key={course.mangoId} className="skillpath-card">
                            {/* Category + Refundable */}
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "flex-start",
                                    flexWrap: "wrap",
                                    gap: 8,
                                    marginBottom: 12,
                                }}
                            >
                                <div
                                    style={{
                                        minWidth: 0,
                                        flex: "1 1 auto",
                                        fontSize: 12,
                                        fontWeight: 700,
                                        color: accentColor,
                                        whiteSpace: "normal",
                                        overflowWrap: "anywhere",
                                    }}
                                >
                                    {course.mainCategory}
                                </div>

                                {course.refundable && (
                                    <div
                                        style={{
                                            flexShrink: 0,
                                            padding: "4px 7px",
                                            borderRadius: 20,
                                            background: "#ECFDF3",
                                            color: "#218C4B",
                                            fontSize: 10,
                                            fontWeight: 700,
                                            whiteSpace: "nowrap",
                                        }}
                                    >
                                        Refundable
                                    </div>
                                )}
                            </div>

                            {/* Course name */}
                            <h3
                                style={{
                                    margin: 0,
                                    fontSize: 20,
                                    lineHeight: 1.3,
                                    color: "#111111",
                                }}
                            >
                                {course.courseName}
                            </h3>

                            {/* Description */}
                            <p
                                style={{
                                    margin: "10px 0",
                                    fontSize: 14,
                                    lineHeight: 1.5,
                                    color: "#666666",
                                    display: "-webkit-box",
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: "vertical",
                                    overflow: "hidden",
                                }}
                            >
                                {course.description}
                            </p>

                            {/* Price + course type */}
                            <div
                                style={{
                                    marginTop: "auto",
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "flex-end",
                                    gap: 10,
                                }}
                            >
                                <div>
                                    <div
                                        style={{
                                            fontSize: 20,
                                            fontWeight: 800,
                                            color: accentColor,
                                        }}
                                    >
                                        {formatPrice(course)}
                                    </div>

                                    <div
                                        style={{
                                            marginTop: 5,
                                            fontSize: 11,
                                            color: "#999999",
                                        }}
                                    >
                                        {course.shortCourse}
                                    </div>
                                </div>

                                <div
                                    style={{
                                        fontSize: 11,
                                        color: "#999999",
                                        textAlign: "right",
                                    }}
                                >
                                    {course.courseType}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <style>
                {`
                    .skillpath-grid {
                        display: grid;
                        grid-template-columns: repeat(3, minmax(0, 1fr));
                        gap: 20px;
                    }
                    .skillpath-card {
                        padding: 20px;
                        border: 1px solid #e5e5e5;
                        border-radius: ${cardRadius}px;
                        background: #ffffff;
                        display: flex;
                        flex-direction: column;
                        min-height: 220px;
                        box-sizing: border-box;
                        transition: transform 0.2s ease,
                                    box-shadow 0.2s ease;
                    }
                    .skillpath-card:hover {
                        transform: translateY(-3px);
                        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
                    }
                    @media (max-width: 1024px) {
                        .skillpath-grid {
                            grid-template-columns: repeat(2, minmax(0, 1fr));
                        }
                    }
                    @media (max-width: 600px) {
                        .skillpath-grid {
                            grid-template-columns: 1fr;
                        }
                    }
                `}
            </style>
        </div>
    )
}

// Framer controls
addPropertyControls(SkillpathCourses, {
    accentColor: {
        type: ControlType.Color,
        title: "Accent Color",
        defaultValue: "#635BFF",
    },

    cardRadius: {
        type: ControlType.Number,
        title: "Card Radius",
        defaultValue: 12,
        min: 0,
        max: 30,
        step: 1,
    },
})
