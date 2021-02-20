<?php

declare(strict_types=1);

namespace App\EventSubscriber;

use ApiPlatform\Core\EventListener\EventPriorities;
use App\Entity\Customer;
use JetBrains\PhpStorm\ArrayShape;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\Security\Core\Security;

class CustomerSubscriber implements EventSubscriberInterface
{
    public function __construct(protected Security $security)
    {
    }

    #[ArrayShape([KernelEvents::VIEW => "array"])]
    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::VIEW => ['setOwnerForCustomer', EventPriorities::PRE_VALIDATE]
        ];
    }

    public function setOwnerForCustomer(ViewEvent $event): void
    {
        $subject = $event->getControllerResult();

        if ($subject instanceof Customer && $event->getRequest()->isMethod(Request::METHOD_POST)) {
            $subject->setOwner($this->security->getUser());
        }
    }
}
