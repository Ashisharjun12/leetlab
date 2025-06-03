import React, { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { companyAPI } from '@/api/api';

const CompanyBadge = ({ companyId }) => {
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!companyId) {
      setCompany(null);
      setLoading(false);
      return;
    }

    async function fetchCompany() {
      setLoading(true);
      try {
        const res = await companyAPI.getCompanyById(companyId);
        setCompany(res.data?.data);
      } catch (err) {
        console.error("Error fetching company by id", companyId, err);
        setCompany(null); // Reset company on error
      } finally {
        setLoading(false);
      }
    }

    fetchCompany();
  }, [companyId]);

  if (loading) {
    return <Skeleton className="h-6 w-20" />;
  }

  if (!company) {
    return <Badge variant="secondary">None</Badge>;
  }

  return (
    <Badge variant="secondary" className="flex items-center gap-1 text-sm font-mediu">
      {company.companyUrl?.url?.url && (
        <img
          src={company.companyUrl.url.url}
          alt={company.name}
          style={{ width: 14, height: 14, borderRadius: "50%", objectFit: "cover" }}
        />
      )}
      <span className="ml-1 truncate" style={{ maxWidth: 80 }}>{company.name}</span>
    </Badge>
  );
};

export default CompanyBadge; 