import { type experimental_StreamingReactResponse, type Message } from 'ai'

export interface Chat extends Record<string, any> {
  id: string
  title: string
  createdAt: number
  userId: string
  path: string
  messages: Message[]
  sharePath?: string
}

export type ServerActionResult<Result> = Promise<
  | Result
  | {
    error: string
  }
>

// TODO: Import from ai/react when it's available.
export type StreamingReactResponseAction = (
  meta: {
    id?: string
    previewToken: string | null
  },
  {
    messages,
    data,
  }: {
    messages: Message[]
    data?: Record<string, string>
  },
) => Promise<experimental_StreamingReactResponse>

// import { Message } from 'ollama/browser'

export type UseChatOptions = {
  /**
   * A unique identifier for the chat. If not provided, a random one will be
   * generated. When provided, the `useChat` hook with the same `id` will
   * have shared states across components.
   */
  id?: number | string
  /**
   * Initial messages of the chat. Useful to load an existing chat history.
   */
  initialMessages?: Message[]
  /**
   * The model to use for the chat. If not provided, the default model will be
   * used. The default model is set by the server.
   */
  model?: string
  /**
   * Initial input of the chat.
   */
  initialInput?: string
  /**
   * Callback function to be called when the API response is received.
   */
  onResponse?: (response: Response) => void | Promise<void>
  /**
   * Callback function to be called when the chat is finished streaming.
   */
  onFinish?: (message: Message) => void
  /**
   * Callback function to be called when an error is encountered.
   */
  onError?: (error: Error) => void
  /**
   * Extra body object to be sent with the API request.
   * @example
   * Send a `sessionId` to the API along with the messages.
   * ```js
   * useChat({
   *   body: {
   *     sessionId: '123',
   *   }
   * })
   * ```
   */
  body?: object
}

export type UseChatHelpers = {
  /** Current messages in the chat */
  messages: Message[]
  /** The error object of the API request */
  error: undefined | Error
  /**
   * Append a user message to the chat list. This triggers the API call to fetch
   * the assistant's response.
   * @param message The message to append
   * @param options Additional options to pass to the API call
   */
  append: (message: Message) => Promise<void>
  /**
   * Reload the last AI chat response for the given chat history. If the last
   * message isn't from the assistant, it will request the API to generate a
   * new response.
   */
  reload: () => Promise<void>
  /**
   * Abort the current request immediately, keep the generated tokens if any.
   */
  stop: () => void
  /**
   * Update the `messages` state locally. This is useful when you want to
   * edit the messages on the client, and then trigger the `reload` method
   * manually to regenerate the AI response.
   */
  setMessages: (messages: Message[]) => void
  /** The current value of the input */
  input: string
  /** setState-powered method to update the input value */
  setInput: React.Dispatch<React.SetStateAction<string>>
  /** An input/textarea-ready onChange handler to control the value of the input */
  handleInputChange: (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>,
  ) => void
  /** Form submission handler to automattically reset input and append a user message  */
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  metadata?: Object
  /** Whether the API request is in progress */
  isLoading: boolean
}
