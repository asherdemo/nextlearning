## what is Accessibility ？
Accessibility refers to designing and implementing web applications that everyone can use, including those with disabilities.

## How to  catch accessibility issues  ?
/package.json
"scripts": {
    "lint": "next lint"
},


run
```
npm run lint
```

## Example
if you remove the alt prop from the image. you can  see following err when run 'npm run lint'
<Image
  src={invoice.image_url}
  className="rounded-full"
  width={28}
  height={28}
  alt={`${invoice.name}'s profile picture`} // Delete this line
/>

$ next lint

./app/ui/invoices/table.tsx
29:23  Warning: Image elements must have an alt prop, either with meaningful text, or an empty string for decorative images.  jsx-a11y/alt-text

info  - Need to disable some ESLint rules? Learn more here: https://nextjs.org/docs/basic-features/eslint#disabling-rules
Done in 2.35s.

Explain :
In the provided code snippet, alt is an attribute for the <Image> component. The alt attribute is used to provide alternative text for an image. This text is intended to be displayed if the image cannot be loaded or if the user is using assistive technologies such as screen readers.