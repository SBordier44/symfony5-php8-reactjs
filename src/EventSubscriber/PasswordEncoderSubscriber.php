<?php

declare(strict_types=1);

namespace App\EventSubscriber;

use ApiPlatform\Core\EventListener\EventPriorities;
use JetBrains\PhpStorm\ArrayShape;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Symfony\Component\Security\Core\User\UserInterface;

class PasswordEncoderSubscriber implements EventSubscriberInterface
{
    public function __construct(protected UserPasswordEncoderInterface $passwordEncoder)
    {
    }

    #[ArrayShape([KernelEvents::VIEW => "array"])]
    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::VIEW => ['encodePassword', EventPriorities::PRE_WRITE]
        ];
    }

    public function encodePassword(ViewEvent $event): void
    {
        $subject = $event->getControllerResult();

        if ($subject instanceof UserInterface && $event->getRequest()->isMethod(Request::METHOD_POST)) {
            $subject->setPassword($this->passwordEncoder->encodePassword($subject, $subject->getPassword()));
        }
    }
}
