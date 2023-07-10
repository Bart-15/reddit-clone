"use client"

import { FC, useCallback, useEffect, useRef, useState } from 'react';
import TextAreaAutosize from 'react-textarea-autosize';
import { useForm } from 'react-hook-form';
import { PostInputValidator, PostValidator } from '@/lib/validators/post';
import { zodResolver } from '@hookform/resolvers/zod'
import type EditorJS from '@editorjs/editorjs'
import { uploadFiles } from '@/lib/validators/uploadthing';
import { toast } from '@/hooks/use-toast';
import { useCreatePost } from '@/data/query-hooks/subreddit/';

interface EditorProps {
    subredditId: string
}

const Editor: FC<EditorProps> = ({subredditId}) => {

    const { mutate: createPost, isLoading: postLoading } = useCreatePost();

    const { register, handleSubmit, formState: { errors } } = useForm<PostInputValidator>({
        resolver: zodResolver(PostValidator),
        defaultValues: {
            subredditId,
            title: '',
            content: null
        }
    });

    const editorRef = useRef<EditorJS>();
    const titleInputRef = useRef<HTMLTextAreaElement>(null);
    const [isMounted, setMounted] = useState<boolean>(false)

    useEffect(() => {
        if(typeof window !== 'undefined'){
            setMounted(true)
        }
    }, [])

    const initializeEditor = useCallback(async() => {
        const EditorJS = (await import('@editorjs/editorjs')).default
        const Header = (await import('@editorjs/header')).default
        const Embed = (await import('@editorjs/embed')).default
        const Table = (await import('@editorjs/table')).default
        const List = (await import('@editorjs/list')).default
        const Code = (await import('@editorjs/code')).default
        const LinkTool = (await import('@editorjs/link')).default
        const InlineCode = (await import('@editorjs/inline-code')).default
        const ImageTool = (await import('@editorjs/image')).default

        if(!editorRef.current) {
            const editor = new EditorJS({
                holder: 'editor',
                onReady() {
                    editorRef.current = editor
                }, 
                placeholder: 'Type here to write your post...',
                data: {
                    blocks: []
                },
                tools: {
                    header: Header,
                    linkTool: {
                        class: LinkTool,
                        config: {
                            endpoint: '/api/link'
                        }
                    },
                    image: {
                        class: ImageTool,
                        config: {
                            uploader: {
                                async uploadByFile(file: File){
                                    const [res] = await uploadFiles([file], 'imageUploader');

                                    return {
                                        success: 1,
                                        file: {
                                            url: res.fileUrl
                                        }
                                    }
                                }
                            }
                        }
                    },
                    list: List,
                    code: Code,
                    InlineCode: InlineCode,
                    table: Table,
                    embed: Embed
                }
            })
        }

    }, []);

    useEffect(() => {
        if(Object.keys(errors).length) {
            for (const [_key, value] of Object.entries(errors)) {
                toast({
                    title: 'Something went wrong',
                    description: (value as { message: string }).message,
                    variant: 'destructive'
                })
            }
        }
    }, [errors])

    useEffect(() => {
        async function init(){
            await initializeEditor();
            setTimeout(() => {
                titleInputRef.current?.focus();
            }, 0);
        }
        
        if(isMounted){
            init();
            return () => {
                editorRef.current?.destroy();
                editorRef.current = undefined;
            }
        }
    }, [isMounted, initializeEditor])

    //share the ref with react-hookform;

    const { ref: titleRef, ...rest } = register('title');

    const handlePost = async (data: PostInputValidator) => {
        const { title, subredditId, ...rest} = data;

        const blocks = await editorRef.current?.save();

        const payload = {
            title,
            subredditId,
            blocks
        }   

        createPost(payload);
    }

    return ( 
        <div className="w-full p-4 bg-zinc-50 rounded-lg border border-zinc-200">
            <form
            onSubmit={handleSubmit((data) => handlePost(data))}
            id="subreddit-post-form" 
            className='w-fit' 
            >
                <div className="prose prose-stone dark:prose-invert">
                    <TextAreaAutosize
                    ref={(e) => {
                        titleRef(e);

                        // @ts-ignore
                        titleInputRef.current = e;
                    }}
                    {...rest}
                    placeholder='Title' 
                    className="w-full resize-none appearance-none overflow-hidden bg-transparent text-5xl font-bold focus:outline-none" />
                    <div id="editor" className="min-h-[500px]"/>
                </div>    
            </form>
        </div>
    );
}

export default Editor;