import { getCategoriesAPI, createMonthlyBudgetAPI, getBudgetByMonthAPI, updateCategoryBudgetAPI, updateMonthlyBudgetAPI, deleteCategoryBudgetAPI, deleteMonthlyBudgetAPI } from './../api/budget';
import { useState, useEffect } from 'react';
import { useDateContext } from '../../../context/DateContext';
import type { CategoryBudget, MonthlyBudget, Category, MonthlyBudgetDTO, CategoryBudgetDTO } from '../../../types';

export const useBudgets = () => {
    const { currentMonth } = useDateContext();
    const [ monthlyBudget, setMonthlyBudget ] = useState<MonthlyBudget | null>(null);
    const [ categoryBudgets, setCategoryBudgets ] = useState<CategoryBudget[]>([]);
    const [ availableCategories, setAvailableCategories ] = useState<Category[]>([]);
    const [ isLoading, setIsLoading ] = useState(false);
    const [ error, setError ] = useState<string | null>(null);

    useEffect(() => {
        const fetchBudget = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const responseBudget = await getBudgetByMonthAPI(currentMonth);
                const fetchedBudget: MonthlyBudget = responseBudget.data.budget;
                const responseCategories = await getCategoriesAPI();
                const allCategories: Category[] = responseCategories.data.categories;
                const defaultCategory = allCategories.find(c => c.name === "Uncategorized");
                
                if (fetchedBudget) {
                    const fetchedCategoryBudgets: CategoryBudget[] = fetchedBudget.categoryBudgets;
                    const fetchedCategories: Category[] = fetchedCategoryBudgets.map((cb) => ({
                        id: cb.categoryId,
                        name: cb.categoryName
                    }));
    
                    setCategoryBudgets(fetchedCategoryBudgets);
                    setMonthlyBudget(fetchedBudget);
                    
                    if (defaultCategory) {
                        setAvailableCategories([...fetchedCategories, defaultCategory]);
                    } else {
                        setAvailableCategories(fetchedCategories);
                    }
                } else {
                    setCategoryBudgets([]);
                    setMonthlyBudget(null);
                    setAvailableCategories(defaultCategory ? [defaultCategory] : []); 
                }
            } catch(error: any) {
                if (error.response?.status === 404) {
                    setCategoryBudgets([]);
                    setMonthlyBudget(null);
                    setAvailableCategories([]);
                    setError(null); 
                } else {
                    setError(error.message || 'Failed to fetch budget');
                    console.error('Failed to fetch budget:', error);
                }
            } finally {
                setIsLoading(false);
            }
        }
        
        fetchBudget();
    }, [currentMonth]);

    const addMonthlyBudget = async (data: MonthlyBudgetDTO): Promise<MonthlyBudget> => {
        setIsLoading(true);
        setError(null);
        try {
            data.month = currentMonth;
            const response = await createMonthlyBudgetAPI(data);
            const newBudget: MonthlyBudget = response.data.monthlyBudget;
            const newCategoryBudgets: CategoryBudget[] = newBudget.categoryBudgets;
            const newCategories: Category[] = newCategoryBudgets.map((cb) => ({
                id: cb.categoryId,
                name: cb.categoryName
            }));
            
            setMonthlyBudget(newBudget);
            setCategoryBudgets(newCategoryBudgets);
            setAvailableCategories(newCategories);
            
            return newBudget;
        } catch(error: any) {
            setError(error.message || 'Failed to create monthly budget');
            console.error('Failed to create budget:', error);
            throw error; 
        } finally {
            setIsLoading(false);
        }
    }

    const editMonthlyBudget = async (id: number, data: MonthlyBudgetDTO): Promise<MonthlyBudget> => {
        setIsLoading(true);
        setError(null);
        try {
            data.month = currentMonth;
            const response = await updateMonthlyBudgetAPI(id, data);
            const updatedBudget: MonthlyBudget = response.data.monthlyBudget;
            const updatedCategoryBudgets: CategoryBudget[] = updatedBudget.categoryBudgets;
            const updatedCategories: Category[] = updatedCategoryBudgets.map((cb) => ({
                id: cb.categoryId,
                name: cb.categoryName
            }));
            
            setMonthlyBudget(updatedBudget);
            setCategoryBudgets(updatedCategoryBudgets);
            setAvailableCategories(updatedCategories);
            
            return updatedBudget;
        } catch(error: any) {
            setError(error.message || 'Failed to update monthly budget');
            console.error('Failed to update budget:', error);
            throw error; 
        } finally {
            setIsLoading(false);
        }
    }

    const editCategoryBudget = async (id: number, data: CategoryBudgetDTO): Promise<CategoryBudget> => {
        setIsLoading(true);
        setError(null);
        try{
            const response = await updateCategoryBudgetAPI(id, data);
            const updatedCategoryBudget = response.data.categoryBudget;
            const updatedCategoryBudgets = categoryBudgets.map((prev) => prev.categoryId === id ? updatedCategoryBudget : prev);
            
            setMonthlyBudget(prev => prev ? {
                ...prev,
                categoryBudgets: updatedCategoryBudgets
            } : null)

            const updatedCategories: Category[] = updatedCategoryBudgets.map((cb) => ({
                id: cb.categoryId,
                name: cb.categoryName
            }));
            setAvailableCategories(updatedCategories);
            setCategoryBudgets(updatedCategoryBudgets);
            return updatedCategoryBudget;
        }catch(error: any){
            setError(error.message || 'Failed to update category budget');
            console.error('Failed to update category budget:', error);
            throw error; 
        }finally{
            setIsLoading(false);
        }
    }

    const removeCategoryBudget = async (id: number) => {
        setIsLoading(true);
        setError(null);
        try{
            await deleteCategoryBudgetAPI(id);

            const updatedCategoryBudgets = categoryBudgets.filter((prev) => prev.id !== id);
            
            setCategoryBudgets(updatedCategoryBudgets);

            setMonthlyBudget(prev => prev ? {
                ...prev,
                categoryBudgets: updatedCategoryBudgets
            } : null);

            const updatedCategories: Category[] = updatedCategoryBudgets.map((cb) => ({
                id: cb.categoryId,
                name: cb.categoryName
            }));
            setAvailableCategories(updatedCategories);

        } catch(error: any){
            console.error('Failed to delete category budget', error);
            setError(error.message || 'Failed to delete category budget');
            throw error;
        }finally{
            setIsLoading(false);
        }
    }

    const removeMonthlyBudget = async (id: number) => {
        setIsLoading(true);
        setError(null);
        try{
            await deleteMonthlyBudgetAPI(id);
            setAvailableCategories([]);
            setCategoryBudgets([]);
            setMonthlyBudget(null);
        }catch(error: any){
            console.error('Failed to delete monthly budget', error);
            setError(error.message || 'Failed to delete monthly budget');
            throw error;
        }finally{
            setIsLoading(false);
        }
    }

    return {monthlyBudget, categoryBudgets, availableCategories, isLoading, error, addMonthlyBudget, editMonthlyBudget, editCategoryBudget, removeCategoryBudget, removeMonthlyBudget}
}