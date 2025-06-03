import React from 'react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Code, ChevronDown, CodeXml } from 'lucide-react';

const PreferNav = ({ selectedLanguage, onLanguageChange, availableLanguages, onFormatCode }) => {
    return (
        <div className="h-10 border-b border-border flex items-center justify-between px-2 text-sm">
            {/* Left Section: Code Title, Icon, and Language Selector */}
            <div className="flex items-center gap-2">
                {/* Code Title and Icon */}
                <div className="flex items-center gap-1">
                    <Code className="h-4 w-4 text-green-500" />
                    <span className="font-semibold">Code</span>
                </div>

                {/* Language Selector */}
                <div className="flex items-center gap-1 ml-2">
                   
                    <Select value={selectedLanguage} onValueChange={onLanguageChange}>
                        <SelectTrigger className="w-auto bg-transparent border-none h-auto p-2 text-sm font-medium">
                            <SelectValue />{/* Just show the selected value */}
                        </SelectTrigger>
                        <SelectContent>
                            {availableLanguages.map(lang => (
                                <SelectItem key={lang} value={lang}>
                                    {lang}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                   
                </div>
            </div>

            {/* Right Section: Format Code Icon */}
            <div className="flex items-center gap-2 text-muted-foreground">
                {/* Format Code Icon */}
                 <CodeXml
                    className="h-4 w-4 cursor-pointer hover:text-primary"
                    onClick={onFormatCode} 
                  />
            </div>
        </div>
    );
};

export default PreferNav;