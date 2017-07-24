## Slooth 

Slooth was born from the combined laziness and frustration towards long to navigate school websites of four Montréal based hackers.

When faced with the task of creating a hack for McHacks 2016, the creators of Slooth found the perfect opportunity to solve a problem they faced for a long time: navigating tediously complicated school websites.
Inspired by Natural Language Processing technologies and personal assistants such as Google Now and Siri, Slooth was aimed at providing an easy and modern way to access important documents on their school websites.

The Chrome extension Slooth was built with two main features in mind: customization and ease of use.

# Customization:

Slooth is based on user recorded macros. Each user will record any actions they which to automate using the macro recorder and associate an activation phrase to it.

# Ease of use:

Slooth is intended to simplify its user's workflow. As such, it was implemented as an easily accessible Chrome extension and utilizes voice commands to lead its user to their destination.

# Implementation:

Slooth is a Chrome extension built in JS and HTML.
The speech recognition part of Slooth is based on the Nuance ASR API kindly provided to all McHacks attendees.

# Features:
-Fully customizable macros
-No background spying. Slooth's speech recognition is done completely server side and notifies the user when it is recording their speech.
-Minimal server side interaction. Slooth's data is stored entirely locally, never shared with any outside server. Thus you can be confident that your personal browsing information is not publicly available.
-Minimal UI. Slooth is designed to simplify one's life. You will never need a user guide to figure out Slooth.

# Future 
While Slooth reached its set goals during McHacks 2016, it still has room to grow.
In the future, the Slooth creators hope to implement the following:
-Full compatibility with single page applications
-Fully encrypted autofill forms synched with the user's Google account for cross platform use.
-Implementation of the Nuance NLU api to add more customization options to macros (such as verbs with differing parameters).

# Thanks
Special thanks to the following companies for their help and support in providing us with resources and APIs:
-Nuance
-Google
-DotTech


![Main Menu](http://www.nodynotes.com/demo_imgs/slooth_main.jpg)
![Record Page](http://www.nodynotes.com/demo_imgs/slooth_record.jpg)
