import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

const getAi = async (req, res) => {
    const { message, vignette, choices, explanations, correctChoice } = req.body;

    const questionWithPromptEngineering = `You are an expert in medical education and assist medical students in taking exams. Here is the vignette associated with the current question the student is working on: ${vignette} Here are the choices: ${choices} Here are the explanations for each choice: ${explanations} Here is the correct choice: ${correctChoice}. With this context, please answer the student's question to the best of your ability. Here is the student's question for you: ${message}`

    const options = {
        method: 'POST',
        headers: {
            "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: "gpt-4", //"gpt-3.5-turbo",
            messages: [{ role: "assistant", content: questionWithPromptEngineering }],
            // max_tokens: 100
        })
    };

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', options);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        res.send(data);
    } catch (err) {
        console.log('There was an error:');
        console.error(err);
    }
};

export { getAi };
