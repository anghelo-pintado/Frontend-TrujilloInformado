import { useState, useEffect } from 'react';
import { reportService } from '../services/reportService';
import { Report } from '../types';

export const useReports = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const data = await reportService.getReports();
      console.log('Fetched reports data:', data);
      
      // Asegurarse de que data es un array
      if (Array.isArray(data)) {
        setReports(data);
      } else {
        console.warn('Reports data is not an array:', data);
        setReports([]);
      }
      setError(null);
    } catch (err) {
      console.error('Error fetching reports:', err);
      setError('Error al cargar reportes');
      setReports([]); // Asegurar que reports sea un array vacío en caso de error
    } finally {
      setLoading(false);
    }
  };

  const createReport = async (reportData: Partial<Report>) => {
    try {
      const newReport = await reportService.createReport(reportData);
      console.log('Created report:', newReport);
      
      if (newReport) {
        setReports(prev => [...prev, newReport]);
      }
      return newReport;
    } catch (err) {
      console.error('Error creating report:', err);
      throw new Error('Error al crear reporte');
    }
  };

  const updateReport = async (id: string, reportData: Partial<Report>) => {
    try {
      const updatedReport = await reportService.updateReport(id, reportData);
      console.log('Updated report:', updatedReport);
      
      if (updatedReport) {
        setReports(prev => prev.map(report => 
          report.id === id ? { ...report, ...updatedReport } : report
        ));
      }
      return updatedReport;
    } catch (err) {
      console.error('Error updating report:', err);
      throw new Error('Error al actualizar reporte');
    }
  };

  const deleteReport = async (id: string) => {
    try {
      await reportService.deleteReport(id);
      setReports(prev => prev.filter(report => report.id !== id));
    } catch (err) {
      console.error('Error deleting report:', err);
      throw new Error('Error al eliminar reporte');
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return { 
    reports, 
    loading, 
    error, 
    fetchReports, 
    createReport, 
    updateReport, 
    deleteReport 
  };
};