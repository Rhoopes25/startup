## Elevator Pitch 

Have you ever struggled to make sense of your emotions after a tough day, or felt unsure how to calm your mind when stress takes over? The Emotional Check-In app offers a simple, effective way to reconnect with yourself. Users can log how they’re feeling, journal their thoughts, and practice calming exercises. As you track your emotions over time, the app helps you recognize patterns and build emotional resilience. It’s a safe, supportive tool to help you feel heard, understood, and more in control of your well-being. 

## Key Features

- Secure login over HTTPS
- Emotion rating with buttons to select and record how users are feeling
- Journaling feature with a text area for users to write down their thoughts and feelings
- Guided breathing exercise with visual aids for relaxation
- Intuitive navigation with links or menus to move between sections easily
- User-friendly interface designed to create a safe and supportive experience


## Technologies

I am going to use the required technologies in the following ways.

- __HTML__ - Structure with HTML elements. Four HTML pages. One for Home Page which will include a login. One for Emotion rating using buttons. One is for Journaling where the user can write down their feelings. One for calming exercises will include a breathing exercise and visual aid. Hyperlinks or navigation components for movement between sections.

- __CSS__ - Create a clean and calming aesthetic. Use CSS to get nice soft blues and fonts.

- __JavaScript__ - Add interactivity to the app. Validates the login. Handles user interactions when a user rates emotions.  

- __React__ - Breaks down the app into reusable components. LoginForm, JournalForm, and EmotionRating. State management rack user inputs (e.g., journal entries, emotion ratings) and synchronize with the database.

- __Web Service__ - Create backend endpoints for saving journal entries and emotion ratings.

- __Authetication__ - Implement user authentication. After login, display a personalized greeting with the user’s name.

- __Database Data__ - Store data in a database. Emotion ratings and journal entries. 

- __WebSocket Data__ - Send daily motivational messages to all logged-in users in real-time. A user logs in, and a real-time notification appears 

- __Quote API__ -  The API provides a random quote or a curated selection based on topics like mindfulness, motivation, or wellness.



## Design Image

![Mock](image.png)
## HTML deliverable

For this deliverable I built out the structure of my application using HTML.

- [x] **HTML pages** - Four HTML page that represent the ability to login and vote.
- [x] **Links** - The login page automatically links to the rate page. The rate page contains links journal and breathe page. Journal page links to breathe and rate page. Breathe page links to all other pages.
- [x] **Text** - Each button has a textual description, making it clear and easy for users to understand their options.
- [x] **Images** - image on the last page of breathing 
- [x] **DB/Login** - Input box and submit button for login. The rate emotions represent data pulled from the database. Also the journal will store data
- [x] **WebSocket** - When you click the emotion buttons it will pop up with a response.

## CSS deliverable

For this deliverable I properly styled the application into its final appearance.

- [x] **Header, footer, and main content body**
- [x] **Navigation elements** - I dropped the underlines and changed the color for anchor elements.
- [x] **Responsive to window resizing** - I made it so my app will adjust to all sizes
- [x] **Application elements** - Used good contrast and whitespace
- [x] **Application text content** - Consistent fonts
- [x] **Application images** - background image and image on last page(added a boarder)

## React part 1: Routing deliverable

- [x] **Bundled using Vite** - Easy to install and use Vite.
- [x] **Components** - Easy to bring the code over from HTML and CSS, but had to rework them quite a bit.
- [x] **Router** - Easy to creating the component routing.
