// An info page with a link to the github repo

import './App.css';

const Info = () => {
    return (
        <div className='Info'>
            <h1>Info</h1>
            <p>The chatbot has been primarily developed to let users learn languages in a more fun way, but due to the usage of OpenAI's API it is also much smarter than other chatbots like Replika (and doesn't emotionally manipulate you to get money from you).</p>
            <p>It even corrects the user's errors (which is also powered by OpenAI)</p>
            <p>This has been developed as an open source project which is available <a href="https://github.com/Vuizur/react-gpt3-chatbot">here. </a>
                Contributions of new features and bug fixes are always welcome.</p>
            <p>The chatbot remembers only the last 3 messages you typed. This has been done to save your money. 
                I am quite certain that this makes it the cheapest chatbot that is this intelligent. (Of course, there are other projects like Character.AI using VC money to make their projects temporarily free, so I cannot compete with that.) </p>
            <p>The API key you enter is safe, it is never sent to anyone except to OpenAI's servers to get the answer to your queries.</p>
        </div>
    );
};

export default Info;