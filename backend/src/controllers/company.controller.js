import { eq, sql } from "drizzle-orm";
import { Company } from "../models/company.model.js";
import logger from "../utils/logger.js";
import { db } from "../config/database.js";
import { problem } from "../models/problem.model.js";

export const createCompany = async (req, res) => {
    try {
        logger.info("hitting create compnay route...")
        const { name } = req.body;
  
        if (!name) {
            return res.json({
                success: false,
                message: "Company name is required",
            });
        }
  
        const [createCompany] = await db
            .insert(Company)
            .values({
                name,
            })
            .returning();
  
        return res.status(200).json({
            success: true,
            message: "company created successfully",
            data: createCompany,
        });
    } catch (error) {
        logger.error("error in creating company", error);
        return res.status(500).json({
            success: false,
            message: "Error creating company",
            error: error.message
        });
    }
};

export const getCompanybyId = async (req, res) => {
    try {
        const companyId = req.params.id;
        logger.info(`Getting company by ID: ${companyId}`);
        
        if (!companyId) {
            return res.status(400).json({
                success: false,
                message: "Company ID is required"
            });
        }
     
        const [company] = await db
            .select()
            .from(Company)
            .where(eq(Company.id, companyId));
  
        if (!company) {
            return res.status(404).json({
                success: false,
                message: "Company not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Company retrieved successfully",
            data: company
        });
    } catch (error) {
        logger.error("Error in getCompanybyId:", error);
        return res.status(500).json({
            success: false,
            message: "Error retrieving company",
            error: error.message
        });
    }
};
  
export const getAllCompany = async (req, res) => {
    try {
        logger.info("Getting all companies...");
        
        // Get pagination parameters from query
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        // Get total count of companies
        const [{ count }] = await db
            .select({ count: sql`count(*)` })
            .from(Company);

        // Get companies with pagination
        const companies = await db
            .select()
            .from(Company)
            .limit(limit)
            .offset(offset)
            .orderBy(Company.createdAt);

        return res.status(200).json({
            success: true,
            message: "Companies retrieved successfully",
            data: companies,
            pagination: {
                total: Number(count),
                page,
                limit,
                totalPages: Math.ceil(Number(count) / limit)
            }
        });
    } catch (error) {
        logger.error("Error in getAllCompany:", error);
        return res.status(500).json({
            success: false,
            message: "Error retrieving companies",
            error: error.message
        });
    }
};
  

export const deleteCompanyById = async (req, res) => {
    try {
        logger.info("Hitting delete company route...");
        const companyId = req.params.id;

        // Check if company exists
        const [company] = await db
            .select()
            .from(Company)
            .where(eq(Company.id, companyId));

        if (!company) {
            return res.status(404).json({
                success: false,
                message: "Company not found"
            });
        }

        // Start a transaction
        await db.transaction(async (tx) => {
          
            await tx
                .update(problem)
                .set({ companyId: null })
                .where(eq(problem.companyId, companyId));

            // Delete the company
            const [deletedCompany] = await tx
                .delete(Company)
                .where(eq(Company.id, companyId))
                .returning();

            return deletedCompany;
        });

        return res.status(200).json({
            success: true,
            message: "Company deleted successfully. Associated problems have been unlinked.",
            data: company
        });
    } catch (error) {
        logger.error("Error in deleteCompanyById:", error);
        return res.status(500).json({
            success: false,
            message: "Error deleting company",
            error: error.message
        });
    }
};

export const updateComapny = async(req,res)=>{
    try {
        
    } catch (error) {
        logger.error("getting error in update company ",error)
        
    }

}

export const getCompnayByProblemId = async (req, res) => {};