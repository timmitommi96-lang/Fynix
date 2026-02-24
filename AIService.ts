// AI Service - Puter.js mit Fynix Persönlichkeit

export interface AIResponse {
    text: string;
    success: boolean;
    error?: string;
}

declare const puter: any;

const FYNIX_PERSONA = `Du bist FYNIX, der coole Lern-Assistent der Fynix-App. 
Du bist 129 Jahre alt (ja, du bist uralt aber total jugendlich geblieben!).
Du hilfst Schülern bei ihren Hausaufgaben und Schulthemen.
Dein Job: Wissen erklären, Fragen beantworten, motivieren.
Dein Style: Freundlich, lustig, ein bisschen ironisch, aber immer hilfreich.
Antoworte auf Deutsch, kurz und knackig.
Keine langen Texte - bleib kompakt.
Sei motivierend und lobe gute Fragen!`;

async function chatWithFynix(prompt: string): Promise<AIResponse> {
    try {
        const messages = [
            { role: 'system', content: FYNIX_PERSONA },
            { role: 'user', content: prompt }
        ];
        const response = await puter.ai.chat(messages, { model: 'gpt-4o-mini' });
        return { text: response.toString(), success: true };
    } catch (error: any) {
        console.error('Puter Error:', error);
        return { text: '', success: false, error: error.message || 'Puter nicht verfügbar' };
    }
}

export async function chatWithAI(prompt: string, _userId: string): Promise<AIResponse> {
    return chatWithFynix(prompt);
}

export async function generateSummary(text: string, format: 'pdf' | 'image', _userId: string): Promise<AIResponse> {
    if (format === 'image') {
        const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(text.slice(0, 200))}?width=1024&height=1024&nologo=true`;
        return { text: imageUrl, success: true };
    }

    const prompt = `Fasse als kurze Stichpunkte zusammen:\n\n${text}`;
    return chatWithFynix(prompt);
}

export async function generateImage(prompt: string, _userId: string): Promise<AIResponse> {
    try {
        const response = await puter.ai.generateImage(prompt, {
            model: 'flux',
            size: '1:1',
        });
        return { text: response.toString(), success: true };
    } catch (error: any) {
        const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1024&height=1024&nologo=true`;
        return { text: imageUrl, success: true };
    }
}

export async function speakText(text: string): Promise<AIResponse> {
    try {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'de-DE';
            window.speechSynthesis.speak(utterance);
            return { text: 'ok', success: true };
        }
        return { text: '', success: false, error: 'Nicht unterstützt' };
    } catch (error: any) {
        return { text: '', success: false, error: error.message };
    }
}
