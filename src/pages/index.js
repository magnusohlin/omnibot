import { useState } from 'react'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'
import Head from 'next/head'
import Image from 'next/image'
import styles from '@/styles/Home.module.css'

export default function Home() {
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([]);
  const [isFormActive, setIsFormActive] = useState(false);
  const [showLoader, setShowLoader] = useState(false)

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
    const userMesage = { id: uuidv4(), role: 'user', content: inputText }
    setMessages((prevMessages) => [
      ...prevMessages,
      userMesage,
    ]);
    setShowLoader(true)
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
              content:`
                You are a helpful assistant that can understand user input and generate JSON data to interact with a CRUD API.
                Given a user input, generate a JSON response in the format { "action": "<api_action>", "data": { ...<api_data> } }.
                Where API data is your best guess of any or multiple of { title: String, name: String, books: ArrayOfObjectsWithNameKeyAndValue, updates: { name: String } }.

                Supported actions include: "createAuthor", "deleteAuthor", "findAuthor", "getAuthor", "searchAuthors", "updateAuthor", "addBookToAuthor", "addBooksToAuthor", "findBook", "getBook", "removeBooksFromAuthor", "searchBooks", "getBooksForAuthor", and "updateBook".
                If the input is a general question not related to the CRUD API, you should return a full answer completion on the format { "action": "generalQuestion", "data": { answer: <open_ai_completion> } }
              `
            },
            {
              role: "user",
              content: inputText,
            },
          ],
        }),
      });

      const parsedCompletion = await completion.json(); // Await the result of completion.json()
      const rawApiResponse = JSON.parse(parsedCompletion.choices[0].message.content.trim()); // No need to parse, already a JSON object
      console.log(rawApiResponse)
      try {
        const response = await axios.post("/api/process-api-response", rawApiResponse);
        console.log(response)
        const apiResponse = response.data;

        setShowLoader(false)
        setMessages((prevMessages) => [
          ...prevMessages,
          { id: uuidv4(), role: 'assistant', content: JSON.stringify(apiResponse, null, 2) },
        ]);
      } catch (error) {
        throw error
      }
    } catch (error) {
      setShowLoader(false)
      setMessages((prevMessages) => [
        ...prevMessages,
        { id: uuidv4(), role: 'assistant', content: 'Something went wrong, try again...' },
      ]);
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
            { showLoader && (
              <div className={`${styles.messageContainer} ${styles.assistant}`}>
                <div className={styles.messageAvatar}>
                  <Image src="/chatbot.svg" width="40" height="40" alt="Bot avatar" />
                </div>
                <div className={styles.messageContent} style={{ minWidth: '60px', justifyContent: 'center' }}>
                  <div className={styles.dotTyping} />
                </div>
              </div>
            ) }
            {messages.slice(0).reverse().map((message) => (
              <div key={message.id} className={`${styles.messageContainer} ${styles[message.role]}`}>
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
