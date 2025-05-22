import logger from "../utils/logger.js"




export const getAllSubmissions = async (req, res) => {
   
try {
    logger.info("Getting all submissions")
    
} catch (error) {
    logger.error(error)
    return res.status(500).json({
        message: "Internal server error",
        error: error.message
    })
}
}


export const getSubmissionsForProblem = async (req, res) => {
    try {
        logger.info("Getting submissions for problem")
    } catch (error) {
        logger.error(error)
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        })
    }
}

export const getAllTheSubmissionsForProblem = async (req, res) => {
    try {
        logger.info("Getting all submissions for problem")
    } catch (error) {
        logger.error(error)
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        })
    }
}

