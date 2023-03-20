import { useState } from 'react'
import axios from 'axios'
import Head from 'next/head'
import Image from 'next/image'
import styles from '@/styles/Home.module.css'

export default function Home() {
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([]);
  const [isFormActive, setIsFormActive] = useState(false);

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setInputText('');
    handleButtonClick();
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault(); // Prevents the default behavior (creating a new line)
      setInputText('');
      handleButtonClick(); // Submits the form
    }
  };

  const handleFocus = () => {
    setIsFormActive(true);
  };

  const handleBlur = () => {
    setIsFormActive(false);
  };

  const handleButtonClick = async () => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: 'user', content: inputText },
    ]);
    setInputText('');

    try {
      const completion = await fetch("/api/openai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content:
                'You are a helpful assistant that can understand user input and generate JSON data to interact with a CRUD API. Given a user input, generate a JSON response in the format { "action": "<api_action>", "data": { ...<api_data> } }. Where API data is your best guess of any or multiple of { title: String, name: String, books: Array }. Supported actions include: "createAuthor", "deleteAuthor", "findAuthor", "getAuthor", "searchAuthors", "updateAuthor", "addBookToAuthor", "addBooksToAuthor", "findBook", "getBook", "removeBooksFromAuthor", "searchBooks", "getBooksForAuthor", and "updateBook".'
            },
            ...messages,
            {
              role: "user",
              content: inputText,
            },
          ],
        }),
      });

      const parsedCompletion = await completion.json(); // Await the result of completion.json()

      const rawApiResponse = JSON.parse(parsedCompletion.choices[0].message.content.trim()); // No need to parse, already a JSON object
      const response = await axios.post("/api/process-api-response", rawApiResponse);
      const apiResponse = response.data;

      setMessages((prevMessages) => [
        ...prevMessages,
        { role: 'assistant', content: JSON.stringify(apiResponse, null, 2) },
      ]);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <Head>
        <title>Omnibot POC</title>
        <meta name="description" content="An OpenAI experiment" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className={styles.main}>
        <div className={styles.chat}>
          <div className={styles.infoContainer}>
            <span>✨ Create and find authors, books and more with </span><Image src="/chatbot.svg" width="40" height="40" alt="Bot avatar" /><span> Omnibot ✨</span>
          </div>
          <div className={styles.chatContainer}>
            {messages.reverse().map((message, index) => (
              <div key={index} className={`${styles.messageContainer} ${styles[message.role]}`}>
                { message.role === 'assistant' && (
                  <div className={styles.messageAvatar}>
                    <Image src="/chatbot.svg" width="40" height="40" alt="Bot avatar" />
                  </div>
                ) }
                <div className={styles.messageContent}>
                  {message.content}
                </div>
              </div>
            ))}
            <div className={`${styles.messageContainer} ${styles.assistant} ${styles.inSeq}`}>
              <div className={styles.messageContent}>
                I can do things like: Create an author, Delete an author, Find an author, Get an author, Search authors, Update an author, Add a book to an author, Add multiple books to an author, Find a book, Get a book, Remove books from an author, Search books, Get books for an author or even Update a book...
              </div>
            </div>
            <div className={`${styles.messageContainer} ${styles.assistant}`}>
              <div className={styles.messageAvatar}>
                <Image src="/chatbot.svg" width="40" height="40" alt="Bot avatar" />
              </div>
              <div className={styles.messageContent}>
                Hey! How can I help you today?
              </div>
            </div>
          </div>
          <div className={styles.formContainer}>
            <div className={`${styles.inputContainer} ${isFormActive ? styles.activeBorder : ''}`}>
              <form className={styles.form} onSubmit={handleSubmit}>
                <textarea
                  className={styles.textarea}
                  value={inputText}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  placeholder="Enter your input here"
                  rows={3}
                  cols={50}
                />
                <button className={styles.button} type="submit">
                  <Image src="/send.svg" width="20" height="20" alt="Send arrow" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
