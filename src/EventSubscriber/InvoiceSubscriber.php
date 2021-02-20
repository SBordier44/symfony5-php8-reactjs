<?php

declare(strict_types=1);

namespace App\EventSubscriber;

use ApiPlatform\Core\EventListener\EventPriorities;
use App\Entity\Invoice;
use App\Repository\InvoiceRepository;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\Security\Core\Security;

class InvoiceSubscriber implements EventSubscriberInterface
{
    public function __construct(protected Security $security, protected InvoiceRepository $repository)
    {
    }

    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::VIEW => [
                ['setChronoForInvoice', EventPriorities::PRE_VALIDATE],
                ['setSentAtForInvoice', EventPriorities::PRE_VALIDATE]
            ]
        ];
    }

    public function setChronoForInvoice(ViewEvent $event): void
    {
        $subject = $event->getControllerResult();

        if ($subject instanceof Invoice && $event->getRequest()->isMethod(Request::METHOD_POST)) {
            $subject->setChrono($this->repository->findNextChrono($this->security->getUser()));
        }
    }

    public function setSentAtForInvoice(ViewEvent $event): void
    {
        $subject = $event->getControllerResult();

        if (
            $subject instanceof Invoice
            && $subject->getSentAt() === null
            && $event->getRequest()->isMethod(Request::METHOD_POST)
        ) {
            $subject->setSentAt(new \DateTime());
        }
    }
}
