import React, { createContext, useContext, useEffect, useState } from 'react';
import { getSiteData } from '../api/client';

const SiteContext = createContext();

export function SiteProvider({ children }) {
    const [siteData, setSiteData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchSiteData = async () => {
        try {
            setLoading(true);
            const data = await getSiteData();
            setSiteData(data);
            applyTheme(data.theme);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const applyTheme = (theme) => {
        if (!theme) return;
        const root = document.documentElement;
        if (theme.primaryColor) root.style.setProperty('--color-primary', theme.primaryColor);
        if (theme.secondaryColor) root.style.setProperty('--color-secondary', theme.secondaryColor);
        if (theme.accentColor) root.style.setProperty('--color-accent', theme.accentColor);
        if (theme.backgroundColor) root.style.setProperty('--color-background', theme.backgroundColor);
        if (theme.textColor) root.style.setProperty('--color-text', theme.textColor);
        if (theme.headingColor) root.style.setProperty('--color-heading', theme.headingColor);
        if (theme.buttonColor) root.style.setProperty('--color-button', theme.buttonColor);
    };

    useEffect(() => {
        fetchSiteData();
    }, []);

    return (
        <SiteContext.Provider value={{ siteData, loading, error, refreshSiteData: fetchSiteData }}>
            {children}
        </SiteContext.Provider>
    );
}

export function useSite() {
    return useContext(SiteContext);
}
